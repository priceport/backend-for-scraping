const pool = require("../configs/postgresql.config");
const redisClient = require("../configs/redis.config");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const source = {
    auckland:"AELIA_AUCKLAND",
    queenstown:"AELIA_QUEENSLAND",
    christchurch:"AELIA_CHRISTCHURCH",
    melbourne:"LOTTE_MELBOURNE",
    sydney:"HEINEMANN_SYDNEY",
    beauty_bliss:"BEAUTY_BLISS",
    big_barrel:"BIG_BARREL",
    chemist_warehouse:"CHEMIST_WAREHOUSE",
    farmers:"FARMERS",
    brisbane:"LOTTE_BRISBANE",
    mecca:"MECCA",
    nz_liquor:"NZLIQUOR",
    sephora:"SEPHORA",
    whisky_and_more:"WHISKY_AND_MORE"
}

const calculatePricePerUnit = (qty, unit, price) => {
    if (!qty || !unit || !price) return null; // Fallback if any value is missing
    const unitMapping = {
        ml: 1,
        l: 1000,
        g: 1,
        kg: 1000,
    };
    const standardizedQty = qty * (unitMapping[unit.toLowerCase()] || 1);
    return price / standardizedQty;
};
// Helper function to calculate ranks with ties
const calculateRanksWithTies = (items, valueKey) => {
    // Sort items by the value
    const sortedItems = [...items].sort((a, b) => a[valueKey] - b[valueKey]);

    // Assign ranks with ties
    let rank = 1;
    for (let i = 0; i < sortedItems.length; i++) {
        if (i > 0 && sortedItems[i][valueKey] === sortedItems[i - 1][valueKey]) {
            // If value is the same as the previous, keep the rank the same
            sortedItems[i].rank = sortedItems[i - 1].rank;
        } else {
            // Assign the current rank
            sortedItems[i].rank = rank;
        }
        rank++;
    }

    return sortedItems;
};
exports.getDashboardStatsFor = catchAsync(async (req,res,next)=>{
    const sourceQuery = req?.query?.source;

    if(!sourceQuery){
        return next(
            new AppError("Source param required",400)
        )
    }

    const statsQuery = await pool.query(`WITH unique_products AS (
        SELECT 
            DISTINCT ON (ppr.canprod_id, ppr.website) 
            ppr.product_id,
            ppr.canprod_id,
            ppr.website,
            ppr.price_rank,
            ppr.total_peers,
            ppr.price_per_unit,
            ppr.date
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        ORDER BY 
            ppr.canprod_id, ppr.website, ppr.date DESC
    ),
    labeled_data AS (
        SELECT 
            up.website,
            up.canprod_id,
            CASE 
                WHEN up.price_rank = 1 THEN 'cheapest'
                WHEN up.price_rank = up.total_peers THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            unique_products up
    ),
    website_summary AS (
        SELECT 
            ld.website,
            COUNT(DISTINCT ld.canprod_id) AS product_count,
            COUNT(CASE WHEN ld.price_label = 'cheapest' THEN 1 END) AS cheapest_count,
            COUNT(CASE WHEN ld.price_label = 'expensive' THEN 1 END) AS expensive_count,
            COUNT(CASE WHEN ld.price_label = 'midrange' THEN 1 END) AS midrange_count
        FROM 
            labeled_data ld
        GROUP BY 
            ld.website
    ),
    website_ranked AS (
        SELECT 
            ws.website,
            ws.product_count,
            ws.cheapest_count,
            ws.expensive_count,
            ws.midrange_count,
            ROUND((ws.cheapest_count::NUMERIC / NULLIF(ws.product_count, 0)) * 100, 2) AS percentage_cheapest,
            RANK() OVER (ORDER BY ROUND((ws.cheapest_count::NUMERIC / NULLIF(ws.product_count, 0)) * 100, 2) DESC) AS price_rank
        FROM 
            website_summary ws
    )
    SELECT 
        website,
        product_count,
        cheapest_count,
        expensive_count,
        midrange_count,
        percentage_cheapest,
        price_rank
    FROM 
        website_ranked where website = $1;`,[sourceQuery]);

    const distinctCount = await pool.query(`
    SELECT 
    COUNT(DISTINCT p.brand) AS distinct_brands,
    COUNT(DISTINCT p.category) AS distinct_categories
FROM 
    product p
WHERE 
    p.website = $1
    AND p.canprod_id IS NOT NULL;
    `,[sourceQuery]);

    return res.status(200).json({
        status:"success",
        message:"Stats calculated succesfully",
        data:{
            totalProducts:statsQuery?.rows[0]?.product_count,
            cheapestProducts:statsQuery?.rows[0]?.cheapest_count,
            midrangeProducts:statsQuery?.rows[0]?.midrange_count,
            expensiveProducts:statsQuery?.rows[0]?.expensive_count,
            brands:distinctCount?.rows[0]?.distinct_brands,
            categories:distinctCount?.rows[0]?.distinct_categories,
        }
    })
});

exports.getBrandStatsFor = catchAsync(async (req,res,next)=>{

    const sourceQuery = req?.query?.source;
    let filter = req?.query?.filter;

    if(filter=="all"||!filter) filter=null;
    else filter = filter.split(",");

    // if(!sourceQuery){
    //     return next(
    //         new AppError("Source param required",400)
    //     )
    // }

    const brandCount = await pool.query(`WITH unique_products AS (
        SELECT 
            DISTINCT ON (ppr.canprod_id) 
            ppr.product_id,
            ppr.canprod_id,
            ppr.website,
            ppr.price_rank,
            ppr.total_peers,
            ppr.price_per_unit,
            ppr.date,
            p.brand AS product_brand
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        WHERE 
            ($1::text[] IS NULL OR p.category = ANY($1))
        ORDER BY 
            ppr.canprod_id, p.brand
    ),
    filtered_data AS (
        SELECT 
            canprod_id,
            product_brand,
            MIN(price_rank) AS min_rank,
            MAX(price_rank) AS max_rank
        FROM 
            unique_products
        GROUP BY 
            canprod_id, product_brand
    ),
    labeled_data AS (
        SELECT 
            fd.product_brand,
            fd.canprod_id,
            CASE 
                WHEN fd.min_rank = 1 THEN 'cheapest'
                WHEN fd.max_rank = fd.min_rank THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            filtered_data fd
    ),
    brand_summary AS (
        SELECT 
            ld.product_brand,
            COUNT(DISTINCT ld.canprod_id) AS product_count,
            COUNT(CASE WHEN ld.price_label = 'cheapest' THEN 1 END) AS cheapest_count,
            COUNT(CASE WHEN ld.price_label = 'expensive' THEN 1 END) AS expensive_count,
            COUNT(CASE WHEN ld.price_label = 'midrange' THEN 1 END) AS midrange_count
        FROM 
            labeled_data ld
        GROUP BY 
            ld.product_brand
    ),
    brand_ranked AS (
        SELECT 
            bs.product_brand,
            bs.product_count,
            bs.cheapest_count,
            bs.expensive_count,
            bs.midrange_count,
            ROUND((bs.cheapest_count::NUMERIC / NULLIF(bs.product_count, 0)) * 100, 2) AS percentage_cheapest,
            RANK() OVER (ORDER BY ROUND((bs.cheapest_count::NUMERIC / NULLIF(bs.product_count, 0)) * 100, 2) DESC) AS price_rank
        FROM 
            brand_summary bs
    )
    SELECT 
        product_brand AS brand,
        product_count,
        cheapest_count,
        expensive_count,
        midrange_count,
        percentage_cheapest,
        price_rank
    FROM 
        brand_ranked;
    `,[filter]);

    return res.status(200).json({
        status:"success",
        message:"Brand stats calculated succesfully",
        data:{
            brandData:brandCount.rows
        }
    })
})

exports.getCategoryStatsFor = catchAsync(async (req,res,next)=>{

    const sourceQuery = req?.query?.source;
    let filter = req?.query?.filter;

    if(filter=="all"||!filter) filter=null;
    else filter = filter.split(",");

    // if(!sourceQuery){
    //     return next(
    //         new AppError("Source param required",400)
    //     )
    // }
    const categoryCount = await pool.query(`
    
    WITH unique_products AS (
        SELECT 
            DISTINCT ON (ppr.canprod_id) 
            ppr.product_id,
            ppr.canprod_id,
            ppr.website,
            ppr.price_rank,
            ppr.total_peers,
            ppr.price_per_unit,
            ppr.date,
            p.category AS product_category,
            ROW_NUMBER() OVER (PARTITION BY ppr.canprod_id ORDER BY ppr.date DESC) AS row_num
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        WHERE 
            ($1::text[] IS NULL OR p.tag = ANY($1))
    ),
    filtered_data AS (
        SELECT 
            canprod_id,
            product_category,
            MIN(price_rank) AS min_rank,
            MAX(price_rank) AS max_rank
        FROM 
            unique_products
        WHERE 
            row_num = 1
        GROUP BY 
            canprod_id, product_category
    ),
    labeled_data AS (
        SELECT 
            fd.product_category,
            fd.canprod_id,
            CASE 
                WHEN fd.min_rank = 1 THEN 'cheapest'
                WHEN fd.max_rank = fd.min_rank THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            filtered_data fd
    ),
    category_summary AS (
        SELECT 
            ld.product_category,
            COUNT(DISTINCT ld.canprod_id) AS product_count,
            COUNT(CASE WHEN ld.price_label = 'cheapest' THEN 1 END) AS cheapest_count,
            COUNT(CASE WHEN ld.price_label = 'expensive' THEN 1 END) AS expensive_count,
            COUNT(CASE WHEN ld.price_label = 'midrange' THEN 1 END) AS midrange_count
        FROM 
            labeled_data ld
        GROUP BY 
            ld.product_category
    ),
    category_ranked AS (
        SELECT 
            cs.product_category,
            cs.product_count,
            cs.cheapest_count,
            cs.expensive_count,
            cs.midrange_count,
            ROUND((cs.cheapest_count::NUMERIC / NULLIF(cs.product_count, 0)) * 100, 2) AS percentage_cheapest,
            RANK() OVER (ORDER BY ROUND((cs.cheapest_count::NUMERIC / NULLIF(cs.product_count, 0)) * 100, 2) DESC) AS price_rank
        FROM 
            category_summary cs
    )
    SELECT 
        product_category AS category,
        product_count,
        cheapest_count,
        expensive_count,
        midrange_count,
        percentage_cheapest,
        price_rank
    FROM 
        category_ranked;
`,[filter])

    return res.status(200).json({
        status:"success",
        message:"Category stats calculated succesfully",
        data:{
            categoryData:categoryCount.rows
        }
    })
})
//pending
exports.getAllProductsFor = catchAsync(async (req,res,next)=>{
    const source = req.query.source;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const category = req.query.category?.split(",") || null;
    const brand = req.query.brand?.split(",") || null;
    const location = req.query.location?.split(",") || null;
    const pricerank = req.query.pricerank?.split(",").map(Number) || null;
    const sort = req.query.sort || 'price_low_to_high';

    // Validate input
    if (!source) {
        return next(new AppError("Source param required", 400));
    }
    if (limit > 100) {
        return next(new AppError("Limit should be equal or less than 100", 400));
    }

    // Fetch precomputed data from Redis
    const cachedData = await redisClient.get('daily_product_data');
    if (!cachedData) {
        return next(new AppError("Precomputed data not available. Try again later.", 500));
    }

    // Parse cached data
    let products = JSON.parse(cachedData);

    // Apply filters on products_data
    products = products.map(p => {
        let filteredProductsData = p.products_data;

        // Apply category filter
        if (category) {
            filteredProductsData = filteredProductsData.filter(prod => category.includes(prod.category));
        }

        // Apply brand filter
        if (brand) {
            filteredProductsData = filteredProductsData.filter(prod => brand.includes(prod.brand));
        }

        // Apply location filter
        // if (location) {
        //     filteredProductsData = filteredProductsData.filter(prod => location.includes(prod.website));

        //     if (filteredProductsData.length > 0) {
        //         // Recalculate pricerank based on filtered data
        //         const sortedRanks = [...filteredProductsData]
        //             .sort((a, b) => parseInt(a.pricerank.split('/')[0], 10) - parseInt(b.pricerank.split('/')[0], 10));

        //         const rankAdjustMap = new Map();
        //         let currentRank = 1;
        //         sortedRanks.forEach((prod, idx, arr) => {
        //             // Assign rank while maintaining ties
        //             if (idx > 0 && parseInt(prod.pricerank.split('/')[0], 10) > parseInt(arr[idx - 1].pricerank.split('/')[0], 10)) {
        //                 currentRank++;
        //             }
        //             rankAdjustMap.set(prod.website, currentRank);
        //         });

        //         // Update priceranks in filtered products
        //         const totalPeers = rankAdjustMap.size;
        //         filteredProductsData.forEach(prod => {
        //             const newRank = rankAdjustMap.get(prod.website);
        //             prod.pricerank = `${newRank}/${totalPeers}`;
        //         });

        //         // Update source_pricerank and source_price
        //         const sourceProduct = filteredProductsData.find(prod => prod.website === source);
        //         p.source_pricerank = sourceProduct ? rankAdjustMap.get(source) : null;
        //         p.source_price = sourceProduct ? sourceProduct.latest_price : null;
        //     }
        // }

        return {
            ...p,
            products_data: filteredProductsData,
        };
    });

    // Filter by location and recalculate price rank
        products = products.map(product => {
            let filteredProductsData = product.products_data;
            if (location) 
            filteredProductsData = product.products_data.filter(pd => location.includes(pd.website));

            // Calculate price per unit or fallback to flat price
            const rankedProducts = filteredProductsData.map(pd => ({
                ...pd,
                price_per_unit: calculatePricePerUnit(pd.qty, pd.unit, pd.latest_price) || pd.latest_price,
            }));

            // Recalculate ranks with ties
            const rankedWithTies = calculateRanksWithTies(rankedProducts, 'price_per_unit');
            rankedWithTies.forEach(pd => {
                pd.pricerank = `${pd.rank}/${rankedWithTies.length}`;
            });

            // Find the updated source pricerank and price
            const sourceProduct = rankedWithTies.find(pd => pd.website === source);
            const sourcePriceRank = sourceProduct ? parseInt(sourceProduct.pricerank.split('/')[0], 10) : null;
            const sourcePrice = sourceProduct ? sourceProduct.latest_price : null;

            return {
                ...product,
                products_data: rankedWithTies,
                source_pricerank: sourcePriceRank,
                source_price: sourcePrice,
            };
        }).filter(product => product.products_data.length > 0);

    // Remove products where all products_data entries were filtered out
    products = products.filter(p => p.products_data.length > 0);

    // Apply pricerank filter
    if (pricerank) {
        products = products.filter(p =>
            pricerank.includes(p.source_pricerank)
        );
    }

    // Sort data
    if (sort === 'price_low_to_high') {
        products = products.sort((a, b) => a.source_price - b.source_price);
    } else if (sort === 'price_high_to_low') {
        products = products.sort((a, b) => b.source_price - a.source_price);
    } else if (sort === 'pricerank_low_to_high') {
        products = products.sort((a, b) => a.source_pricerank - b.source_pricerank);
    } else if (sort === 'pricerank_high_to_low') {
        products = products.sort((a, b) => b.source_pricerank - a.source_pricerank);
    }

    let paginatedProducts=products;
    // Paginate results
    if(offset&&limit)
    paginatedProducts = products.slice(offset, offset + limit);

    // Send response
    return res.status(200).json({
        status: "success",
        message: `All products for ${source} fetched successfully`,
        data: paginatedProducts,
    });

});

exports.getPriceRankFor = catchAsync(async (req,res,next)=>{
    const sourceQuery = req?.query?.source;

    if(!sourceQuery){
        return next(
            new AppError('No source found!',400)
        )
    }

    const websiteStats = await pool.query(`
    WITH latest_prices AS (
        SELECT 
            p.product_id, 
            p.website,
            p.price,
            pr.qty,
            pr.unit,
            pr.canprod_id,
            ROW_NUMBER() OVER (PARTITION BY p.product_id, p.website ORDER BY p.date DESC) AS rn
        FROM price p
        JOIN product pr ON p.product_id = pr.id
        WHERE pr.canprod_id IS NOT NULL
    ),
    normalized_prices AS (
        SELECT 
            lp.product_id,
            lp.website,
            lp.price,
            lp.canprod_id,
            CASE 
                WHEN lp.qty IS NOT NULL AND lp.unit IS NOT NULL AND lp.qty > 0 THEN lp.price / lp.qty
                ELSE lp.price
            END AS price_per_unit
        FROM latest_prices lp
        WHERE lp.rn = 1
    ),
    price_ranks AS (
        SELECT 
            np.canprod_id,
            np.website,
            np.price_per_unit,
            RANK() OVER (PARTITION BY np.canprod_id ORDER BY np.price_per_unit ASC) AS price_rank
        FROM normalized_prices np
    ),
    website_stats AS (
        SELECT 
            np.website,
            COUNT(CASE WHEN pr.price_rank = 1 THEN 1 END) AS cheapest_products,
            COUNT(CASE WHEN pr.price_rank = (
                SELECT MAX(price_rank) / 2 
                FROM price_ranks
                WHERE canprod_id = pr.canprod_id
            ) THEN 1 END) AS midrange_products,
            COUNT(CASE WHEN pr.price_rank = (
                SELECT MAX(price_rank)
                FROM price_ranks
                WHERE canprod_id = pr.canprod_id
            ) THEN 1 END) AS expensive_products
        FROM price_ranks pr
        JOIN normalized_prices np ON pr.canprod_id = np.canprod_id AND pr.website = np.website
        GROUP BY np.website
    ),
    price_competitiveness AS (
        SELECT 
            website,
            AVG(price_rank) AS avg_price_rank
        FROM price_ranks
        GROUP BY website
    )
    SELECT 
        pc.website,
        pc.avg_price_rank AS price_competitiveness,
        ws.cheapest_products,
        ws.midrange_products,
        ws.expensive_products
    FROM price_competitiveness pc
    JOIN website_stats ws ON pc.website = ws.website
    ORDER BY pc.avg_price_rank ASC;
    `);

    let pricerank=(websiteStats.rows.findIndex(el=>el?.website==sourceQuery)+1)+" / "+websiteStats?.rows?.length;

    return res.status(200).json({
        status:"success",
        message:"Pricerank return succesfully",
        data:{
            locationStats:websiteStats.rows,
            pricerank
        }
    })

})

exports.getAllBrands = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`select distinct brand from product where canprod_id is not null and brand is not null`);

    return res.status(200).json({
        status:"success",
        message:"All brands fetched",
        data:data?.rows
    })
})

exports.getAllLocations = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`select distinct website from product where canprod_id is not null and website is not null`);

    return res.status(200).json({
        status:"success",
        message:"All brands fetched",
        data:data?.rows
    })
})

exports.getDateRange = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`SELECT 
    MIN(date) AS min_date,
    MAX(date) AS max_date
FROM 
    price;
`);

    return res.status(200).json({
        status:"success",
        message:"All brands fetched",
        data:data?.rows
    })
})

exports.getPriceHistory = catchAsync(async (req,res,next)=>{
    const canprod_id = req?.params?.canprod_id;

    if(!canprod_id){
        return next(
            new AppError(`canprod_id required!`,400)
        )
    }
    const data = await pool.query(`
        SELECT 
        p.canprod_id,
        p.title AS product_title,
        ph.date AS price_date,
        ph.price AS product_price,
        ph.website
    FROM 
        product p
    JOIN 
        price ph 
    ON 
        p.id = ph.product_id
    WHERE 
        p.canprod_id = $1
    ORDER BY 
        ph.date ASC;
    `,[canprod_id]);

    const outputData = {};

    for(let i=0;i<data?.rows?.length;i++){
        if(!outputData[data?.rows[i]?.website]) outputData[data?.rows[i]?.website] = {};

        if(!outputData[data?.rows[i]?.website][data?.rows[i]?.product_title]) outputData[data?.rows[i]?.website][data?.rows[i]?.product_title] = [];
        outputData[data?.rows[i]?.website][data?.rows[i]?.product_title].push(data?.rows[i]);
    }

    return res.status(200).json({
        status:"success",
        message:"Price history fetched succesfully!",
        data:outputData
    })
})
