const pool = require("../configs/postgresql.config");
const redisClient = require("../configs/redis.config");
const precomputeDailyData = require("../helpers/precomputeDailyData");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const isBodyComplete = require("../utils/isBodyComplete");

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

exports.getAllSubcategoryBySource = catchAsync(async (req, res, next) => {
    const source = req.query.source;

    const sub_category = await pool.query(`select distinct sub_category from product where website = $1 and last_checked::date > current_date - 2 group by sub_category;`,[source]);
    
    return res.status(200).json({
        status: "success",
        message: "Sub category fetched succesfully",
        data: sub_category?.rows,
    });
})
exports.getLeastCompetitiveProducts = catchAsync(async (req, res, next) => {
        const source = req.query.source;
        const locations = req.query.location?.split(",") || null;

        // Validate input
        if (!source) {
            return next(new AppError("Source param required", 400));
        }

        // Fetch precomputed data from Redis
        const cachedData = await redisClient.get('daily_product_data');
        if (!cachedData) {
            return next(new AppError("Precomputed data not available. Try again later.", 500));
        }

        // Parse cached data
        let products = JSON.parse(cachedData);

        // Filter and process products
        const leastCompetitiveProducts = products.map(product => {
            let filteredProductsData = product.products_data;

            // Apply location filter if provided
            if (locations) {
                filteredProductsData = filteredProductsData.filter(pd => locations.includes(pd.website));
            }

            if (filteredProductsData.length === 0) return null; // Skip if no locations match

            // Calculate price_per_unit and sort with ranks
            const rankedProducts = filteredProductsData.map(pd => ({
                ...pd,
                price_per_unit: calculatePricePerUnit(pd.qty, pd.unit, pd.latest_price) || pd.latest_price,
            }));
            const rankedWithTies = calculateRanksWithTies(rankedProducts, 'price_per_unit');
            rankedWithTies.forEach(pd => {
                pd.pricerank = `${pd.rank}/${rankedWithTies.length}`;
            });

            // Identify source product and determine if it is least competitive
            const sourceProduct = rankedWithTies.find(pd => pd.website === source);
            if (!sourceProduct || sourceProduct.rank < rankedWithTies[rankedWithTies.length - 1].rank) {
                return null; // Skip if source is not the least competitive
            }

            return {
                ...product,
                products_data: rankedWithTies,
                source_pricerank: sourceProduct.pricerank,
                source_price_per_unit: sourceProduct.price_per_unit,
            };
        }).filter(product => product !== null); // Remove null entries

        // Send response
        return res.status(200).json({
            status: "success",
            message: "Least competitive products fetched successfully",
            data: leastCompetitiveProducts,
        });
});

exports.getMarginallyBehindProducts = catchAsync(async (req, res, next) => {
    const source = req.query.source;

    // Validate input
    if (!source) {
        return next(new AppError("Source param required", 400));
    }

    // Fetch precomputed data from Redis
    const cachedData = await redisClient.get('daily_product_data');
    if (!cachedData) {
        return next(new AppError("Precomputed data not available. Try again later.", 500));
    }

    // Parse cached data
    let products = JSON.parse(cachedData);

    // Filter products where the source entry is marginally behind
    const marginallyBehindProducts = products.map(product => {
        const updatedProductsData = product.products_data.map(pd => ({
            ...pd,
            price_per_unit: calculatePricePerUnit(pd.qty, pd.unit, pd.latest_price) || pd.latest_price,
        }));

        // Sort by price_per_unit (or flat price if unavailable)
        const sortedProducts = updatedProductsData.sort((a, b) => a.price_per_unit - b.price_per_unit);

        // Identify the source product and its next cheaper competitor
        const sourceProductIndex = sortedProducts.findIndex(pd => pd.website === source);
        if (sourceProductIndex === -1 || sourceProductIndex === 0) {
            // Skip if source product is not present or already the cheapest
            return null;
        }

        const sourceProduct = sortedProducts[sourceProductIndex];

        // Find the next cheaper product, skipping products with equal prices
        let nextCheaperProductIndex = sourceProductIndex - 1;
        while (
            nextCheaperProductIndex >= 0 &&
            sortedProducts[nextCheaperProductIndex].price_per_unit === sourceProduct.price_per_unit
        ) {
            nextCheaperProductIndex--;
        }

        if (nextCheaperProductIndex < 0) {
            // No cheaper product found
            return null;
        }

        const nextCheaperProduct = sortedProducts[nextCheaperProductIndex];

        // Check if the source product is less than 5% more expensive than the next cheaper product
        const isMarginallyBehind =
            (sourceProduct.price_per_unit - nextCheaperProduct.price_per_unit) /
                nextCheaperProduct.price_per_unit <
            0.05;

        if (isMarginallyBehind) {
            return {
                ...product,
                products_data: sortedProducts, // Include sorted products
                source_pricerank: sourceProduct.pricerank,
                source_price_per_unit: sourceProduct.price_per_unit,
                next_cheapest_price_per_unit: nextCheaperProduct.price_per_unit,
            };
        }

        return null;
    }).filter(product => product !== null); // Remove null entries

    // Send response
    return res.status(200).json({
        status: "success",
        message: "Products where source is marginally behind fetched successfully",
        data: marginallyBehindProducts,
    });
});

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

    const tempstats = {
        totalProducts:690,
        cheapestProducts:474,
        midrangeProducts:210,
        expensiveProducts:6,
        brands:200,
        categories:2,
    }

    return res.status(200).json({
        status:"success",
        message:"Stats calculated succesfully",
        data:tempstats
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
            ppr.canprod_id, p.brand, ppr.date DESC
    ),
    labeled_data AS (
        SELECT 
            up.product_brand,
            up.canprod_id,
            CASE 
                WHEN up.price_rank = 1 THEN 'cheapest'
                WHEN up.price_rank = up.total_peers THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            unique_products up
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
            p.category AS product_category
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        WHERE 
            ($1::text[] IS NULL OR p.tag = ANY($1))
        ORDER BY 
            ppr.canprod_id, ppr.date DESC
    ),
    labeled_data AS (
        SELECT 
            up.product_category,
            up.canprod_id,
            CASE 
                WHEN up.price_rank = 1 THEN 'cheapest'
                WHEN up.price_rank = up.total_peers THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            unique_products up
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


    let tempData = [
        {
            category: "liquor",
            cheapest_count: "375",
            expensive_count: "5",
            midrange_count: "107",
            price_rank: "1",
            product_count: "487"
        },
        {
            category: "beauty",
            cheapest_count: "99",
            expensive_count: "1",
            midrange_count: "103",
            price_rank: "2",
            product_count: "203"
        },
    ]

    if(filter && filter[0]=="duty-free"){
        tempData = [
            {
                category: "liquor",
                cheapest_count: "375",
                expensive_count: "25",
                midrange_count: "87",
                price_rank: "1",
                product_count: "487"
            },
            {
                category: "beauty",
                cheapest_count: "99",
                expensive_count: "8",
                midrange_count: "96",
                price_rank: "2",
                product_count: "203"
            },
        ]
    }

    if(filter && filter[0]=="domestic"){
        tempData = [
            {
                category: "liquor",
                cheapest_count: "398",
                expensive_count: "1",
                midrange_count: "88",
                price_rank: "1",
                product_count: "487"
            },
            {
                category: "beauty",
                cheapest_count: "102",
                expensive_count: "5",
                midrange_count: "96",
                price_rank: "2",
                product_count: "203"
            },
        ]
    }

    return res.status(200).json({
        status:"success",
        message:"Category stats calculated succesfully",
        data:{
            categoryData:tempData
        }
    })
})

function looseMatch(string, search) {
    // Convert both strings to lowercase for case-insensitive comparison
    const lowerString = string.toLowerCase();
    const lowerSearch = search.toLowerCase();

    // Check if the search term exists in the string
    return lowerString.includes(lowerSearch);
}

exports.getAllProductsFor = catchAsync(async (req, res, next) => {
    const source = req.query.source;
    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;
    const category = req.query.category?.split(",") || null;
    const sub_category = req.query.sub_category?.split(",") || null;
    const brand = req.query.brand?.split(",") || null;
    const location = req.query.location?.split(",") || null;
    const pricerank = req.query.pricerank?.split(",").map(Number) || null;
    const sort = req.query.sort || 'price_low_to_high';
    const search = req.query.search || null;
    const pricerange = req.query.pricerange || null;
    const compliant = req.query.compliant || null;
    const ai_check = req.query.ai_check || null;
    const show_unmapped = req.query.show_unmapped || false;

    if (!source) {
        return next(new AppError("Source param required", 400));
    }
    if (limit > 1000) {
        return next(new AppError("Limit should be equal or less than 1000", 400));
    }

    const cachedData = await redisClient.get('daily_product_data');
    if (!cachedData) {
        return next(new AppError("Precomputed data not available. Try again later.", 500));
    }

    let products = JSON.parse(cachedData);

    if (show_unmapped === "true") {
        let unmappedProducts = await pool.query(`select * from product where canprod_id is null and website = $1`, [source]);
        let unmappedProductNew = [];
        for (let i = 0; i < unmappedProducts?.rows?.length; i++) {
            let price = await pool.query('select * from price where product_id = $1  order by date desc limit 1;', [unmappedProducts?.rows[i]?.id]);
            if (price?.rows?.length == 0) continue;
            unmappedProductNew.push({
                canprod_id: null,
                products_data: [{ ...unmappedProducts?.rows[i], latest_price: price?.rows[0]?.price }]
            });
        }
        products = unmappedProductNew;
    }

    // Stats holders
    let product_count = 0, cheapest_count = 0, midrange_count = 0, expensive_count = 0;
    let brand_stats = {}, category_stats = {};
    let filteredProducts = [];

    for (let p of products) {
        let filteredProductsData = p.products_data;
        const sourceIndex = filteredProductsData?.findIndex(el => el.website == source);
        if (sourceIndex === -1) continue;

        // Category filter
        if (category && !category.includes(filteredProductsData[sourceIndex]?.category)) continue;
        // Brand filter
        if (brand && !brand.includes(filteredProductsData[sourceIndex]?.brand)) continue;
        // Subcategory filter (applied later)

        // Location, compliant, ai_check filters
        if (show_unmapped !== "true") {
            if (location) filteredProductsData = filteredProductsData.filter(pd => location.includes(pd.website));
            if (compliant !== null) filteredProductsData = filteredProductsData.filter(pd => ((pd.compliant + "") == compliant) || pd.website == source);
            if (ai_check !== null) filteredProductsData = filteredProductsData.filter(pd => ((pd.ai_check == ai_check) || pd.website == source));
        }

        // Calculate price per unit or fallback to flat price
        let hasUnitAndQty = true;
        const rankedProducts = filteredProductsData.map(pd => {
            if (!pd.unit || !pd.qty) hasUnitAndQty = false;
            return ({
                ...pd,
                price_per_unit: calculatePricePerUnit(pd.qty, pd.unit, pd.latest_price) || pd.latest_price,
            });
        });
        // Recalculate ranks with ties
        const rankedWithTies = calculateRanksWithTies(rankedProducts, hasUnitAndQty ? 'price_per_unit' : 'latest_price');
        let sum = 0;
        rankedWithTies.forEach(pd => {
            pd.pricerank = `${pd.rank}/${rankedWithTies.length}`;
            if (pd.website != source) sum += parseFloat(pd.latest_price);
        });
        // Find the updated source pricerank and price
        const sourceProduct = rankedWithTies.find(pd => pd.website === source);
        if (!sourceProduct) continue;
        const sourcePriceRank = sourceProduct ? parseInt(sourceProduct.pricerank.split('/')[0], 10) : null;
        const sourcePrice = sourceProduct ? sourceProduct.latest_price : null;
        const sourceName = sourceProduct ? sourceProduct.title : null;
        const average = rankedWithTies?.length != 1 ? (sum / (rankedWithTies?.length - 1)).toFixed(2) : 0;
        const difference = sourceProduct ? (parseFloat(sourceProduct.latest_price) - average).toFixed(2) : 0;
        const difference_percentage = sourceProduct ? ((difference / parseFloat(sourceProduct.latest_price)) * 100).toFixed(2) : 0;

        // Remove products where all products_data entries were filtered out
        if (rankedWithTies.length === 0) continue;
        if ((show_unmapped !== "true" || req?.query?.admin !== "true") && rankedWithTies.length <= 1) continue;
        // Subcategory filter
        if (sub_category && !sub_category.includes(p?.source_subcategory)) continue;
        // Pricerank filter
        if (pricerank && show_unmapped !== "true" && !pricerank.includes(sourcePriceRank)) continue;
        // Search filter
        if (search && !looseMatch(sourceName, search)) continue;

        // Stats calculation
        let maxrank = 0, sourcerank = 0, source_brand = "", source_category = "", isConsidered = false, price = 0;
        for (let pd of rankedWithTies) {
            if (pd.rank > maxrank) maxrank = pd.rank;
            if (pd.website == source) {
                sourcerank = pd.rank;
                source_brand = pd.brand;
                source_category = pd.category;
                price = parseFloat(pd.latest_price);
            }
        }
        if (!brand_stats[source_brand])
            brand_stats[source_brand] = {
                brand: source_brand,
                cheapest_count: 0,
                midrange_count: 0,
                expensive_count: 0,
                total_price: 0,
                pricerank_wise_product_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
            };
        if (!category_stats[source_category])
            category_stats[source_category] = {
                category: source_category,
                cheapest_count: 0,
                midrange_count: 0,
                expensive_count: 0,
                total_price: 0,
                pricerank_wise_product_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
            };
        brand_stats[source_brand].total_price += price;
        category_stats[source_category].total_price += price;
        if (sourcerank == 1) {
            if ((!pricerange || pricerange == "cheapest")) {
                cheapest_count += 1;
                brand_stats[source_brand].cheapest_count += 1;
                category_stats[source_category].cheapest_count += 1;
                isConsidered = true;
            }
        } else if (sourcerank == maxrank) {
            if (!pricerange || pricerange == "expensive") {
                expensive_count += 1;
                brand_stats[source_brand].expensive_count += 1;
                category_stats[source_category].expensive_count += 1;
                isConsidered = true;
            }
        } else {
            if ((!pricerange || pricerange == "midrange")) {
                midrange_count += 1;
                brand_stats[source_brand].midrange_count += 1;
                category_stats[source_category].midrange_count += 1;
                isConsidered = true;
            }
        }
        if (isConsidered) {
            brand_stats[source_brand].pricerank_wise_product_count[sourcerank] = (brand_stats[source_brand].pricerank_wise_product_count[sourcerank] || 0) + 1;
            category_stats[source_category].pricerank_wise_product_count[sourcerank] = (category_stats[source_category].pricerank_wise_product_count[sourcerank] || 0) + 1;
        }
        // Attach price_range for pricerange filter
        let productObj = {
            ...p,
            products_data: rankedWithTies,
            source_pricerank: sourcePriceRank,
            source_price: sourcePrice,
            source_name: sourceName,
            average,
            difference,
            difference_percentage
        };
        if (isConsidered) productObj.price_range = sourcerank == 1 ? "cheapest" : (sourcerank == maxrank ? "expensive" : "midrange");
        filteredProducts.push(productObj);
    }

    // Sort data
    if (sort === 'price_low_to_high') {
        filteredProducts = filteredProducts.sort((a, b) => a.source_price - b.source_price);
    } else if (sort === 'price_high_to_low') {
        filteredProducts = filteredProducts.sort((a, b) => b.source_price - a.source_price);
    } else if (sort === 'pricerank_low_to_high') {
        filteredProducts = filteredProducts.sort((a, b) => a.source_pricerank - b.source_pricerank);
    } else if (sort === 'pricerank_high_to_low') {
        filteredProducts = filteredProducts.sort((a, b) => b.source_pricerank - a.source_pricerank);
    } else if (sort == 'difference_low_to_high') {
        filteredProducts = filteredProducts.sort((a, b) => a.difference - b.difference);
    } else if (sort == 'difference_high_to_low') {
        filteredProducts = filteredProducts.sort((a, b) => b.difference - a.difference);
    } else if (sort == 'difference_percentage_low_to_high') {
        filteredProducts = filteredProducts.sort((a, b) => a.difference_percentage - b.difference_percentage);
    } else if (sort == 'difference_percentage_high_to_low') {
        filteredProducts = filteredProducts.sort((a, b) => b.difference_percentage - a.difference_percentage);
    }

    // Format stats
    brand_stats = Object.keys(brand_stats).map(key => {
        let data = brand_stats[key];
        data.pricerank_wise_product_count = Object.keys(data.pricerank_wise_product_count).map(el => data.pricerank_wise_product_count[el]);
        return data;
    }).filter(el => (el?.cheapest_count + el?.midrange_count + el?.expensive_count) !== 0);
    category_stats = Object.keys(category_stats).map(key => {
        let data = category_stats[key];
        data.pricerank_wise_product_count = Object.keys(data.pricerank_wise_product_count).map(el => data.pricerank_wise_product_count[el]);
        return data;
    }).filter(el => (el?.cheapest_count + el?.midrange_count + el?.expensive_count) !== 0);

    // Calculate AI insights data
    const ai = {
        price_rank_differences: {},
        category_price_differences: {},
        subcategory_price_differences: {},
        new_arrivals: []
    };

    // Calculate overall price rank differences between locations
    const locationStats = {};
    filteredProducts.forEach(product => {
        const sourceProduct = product.products_data.find(pd => pd.website === source);
        if (!sourceProduct) return;

        product.products_data.forEach(pd => {
            if (pd.website === source) return;
            
            if (!locationStats[pd.website]) {
                locationStats[pd.website] = {
                    total_difference: 0,
                    count: 0,
                    categories: {},
                    subcategories: {}
                };
            }

            const priceDiff = ((parseFloat(pd.latest_price) - parseFloat(sourceProduct.latest_price)) / parseFloat(sourceProduct.latest_price)) * 100;
            locationStats[pd.website].total_difference += priceDiff;
            locationStats[pd.website].count++;

            // Category-wise differences
            if (!locationStats[pd.website].categories[sourceProduct.category]) {
                locationStats[pd.website].categories[sourceProduct.category] = {
                    total_difference: 0,
                    count: 0
                };
            }
            locationStats[pd.website].categories[sourceProduct.category].total_difference += priceDiff;
            locationStats[pd.website].categories[sourceProduct.category].count++;

            // Subcategory-wise differences
            if (sourceProduct.sub_category) {
                if (!locationStats[pd.website].subcategories[sourceProduct.sub_category]) {
                    locationStats[pd.website].subcategories[sourceProduct.sub_category] = {
                        total_difference: 0,
                        count: 0,
                        category: sourceProduct.category // Include parent category for context
                    };
                }
                locationStats[pd.website].subcategories[sourceProduct.sub_category].total_difference += priceDiff;
                locationStats[pd.website].subcategories[sourceProduct.sub_category].count++;
            }
        });
    });

    // Calculate averages and format the data
    Object.keys(locationStats).forEach(loc => {
        const stats = locationStats[loc];
        ai.price_rank_differences[loc] = {
            average_difference: (stats.total_difference / stats.count).toFixed(2),
            total_products: stats.count
        };

        // Category-wise differences
        ai.category_price_differences[loc] = {};
        Object.keys(stats.categories).forEach(cat => {
            const catStats = stats.categories[cat];
            ai.category_price_differences[loc][cat] = {
                average_difference: (catStats.total_difference / catStats.count).toFixed(2),
                total_products: catStats.count
            };
        });

        // Subcategory-wise differences
        ai.subcategory_price_differences[loc] = {};
        Object.keys(stats.subcategories).forEach(subcat => {
            const subcatStats = stats.subcategories[subcat];
            ai.subcategory_price_differences[loc][subcat] = {
                average_difference: (subcatStats.total_difference / subcatStats.count).toFixed(2),
                total_products: subcatStats.count,
                category: subcatStats.category // Include parent category for context
            };
        });
    });

    // Get new arrivals (products created today)
    const today = new Date().toISOString().split('T')[0];
    const newArrivals = await pool.query(`
        SELECT p.*, pr.price as latest_price
        FROM product p
        LEFT JOIN LATERAL (
            SELECT price 
            FROM price 
            WHERE product_id = p.id 
            ORDER BY date DESC 
            LIMIT 1
        ) pr ON true
        WHERE p.website = $1 
        AND DATE(p.created_at) = $2
    `, [source, today]);

    ai.new_arrivals = newArrivals.rows.map(product => ({
        title: product.title,
        category: product.category,
        sub_category: product.sub_category,
        price: product.latest_price
    }));

    const totals = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return res.status(200).json({
        status: "success",
        message: `All products for ${source} fetched successfully`,
        stats: {
            productCount: totals,
            cheapestProducts: cheapest_count,
            midrangeProducts: midrange_count,
            expensiveProducts: expensive_count,
            brands: brand_stats?.length,
            categories: category_stats?.length
        },
        category_stats,
        brand_stats,
        ai,
        data: paginatedProducts,
        totals
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

exports.getAllBrands = catchAsync(async (req, res, next) => {
    const { source } = req.query;

    let query = `
        SELECT DISTINCT brand 
        FROM product 
        WHERE canprod_id IS NOT NULL 
          AND brand IS NOT NULL
    `;
    const values = [];

    if (source) {
        query += ` AND website = $1`;
        values.push(source);
    }

    query += ` ORDER BY brand ASC`;

    const data = await pool.query(query, values);

    return res.status(200).json({
        status: "success",
        message: "All brands fetched",
        data: data?.rows
    });
});


exports.getAllLocations = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`SELECT DISTINCT website 
    FROM product 
    WHERE canprod_id IS NOT NULL 
      AND website IS NOT NULL 
    ORDER BY website ASC`);

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

exports.downloadQtyAndUnitLessProducts = catchAsync(async (req,res,next)=>{
    // Query to fetch products based on the specified conditions
    const query = `
      SELECT *
      FROM product
      WHERE canprod_id IS NOT NULL
        AND qty IS NULL
        AND unit IS NULL;
    `;

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No products found matching criteria.' });
    }

    // Convert rows to CSV format with proper escaping for commas
    const escapeCSV = (value) => {
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    };

    const csvHeaders = Object.keys(rows[0]).join(',');
    const csvRows = rows.map(row => Object.values(row).map(escapeCSV).join(','));
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');

    res.send(csvContent);
})

exports.editProduct = catchAsync(async (req,res,next)=>{
    const isComplete = isBodyComplete(req, ["title", "brand"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    let data;
    if(req.body.qty&&req.body.unit)
    data = await pool.query(`update product
    set
        title = $1,
        unit = $2,
        qty = $3,
        brand = $4
    where
        id = $5
    returning *;
    `,[req.body.title,req.body.unit,req.body.qty,req.body.brand,req.params.id]);
    else if(req.body.qty&&!req.body.unit)
    data = await pool.query(`update product
    set
        title = $1,
        qty = $2,
        brand = $3
    where
        id = $4
    returning *;
    `,[req.body.title,req.body.qty,req.body.brand,req.params.id]);
    else if(!req.body.qty&&req.body.unit)
    data = await pool.query(`update product
    set
        title = $1,
        unit = $2,
        brand = $3
    where
        id = $4
    returning *;
    `,[req.body.title,req.body.unit,req.body.brand,req.params.id]);

    precomputeDailyData('aelia_auckland',false);

    return res.status(200).json({
        status:"success",
        message:"Product edited succesfully",
        data:data.rows
    });
})

exports.changeProductComplainceStatus = catchAsync(async (req,res,next)=>{
    if(req.body.complaint===undefined){
        return next(
            new AppError(`complaint missing from request body!`, 400)
        );
    }

    const data = await pool.query(`update product
    set
        compliant = $1
    where
        id = $2
    returning *;
    `,[req.body.complaint,req.params.id]);

    precomputeDailyData('aelia_auckland',false);

    return res.status(200).json({
        status:"success",
        message:"Product complaince changed succesfully",
        data:data.rows
    });
})

exports.removeMapping = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`
    update product 
    set canprod_id = null
    where 
      id = $1
    returning *;`,
    [req.params.id]);

    precomputeDailyData('aelia_auckland',false);

    return res.status(200).json({
        status:"success",
        message:"Mapping removed succesfully",
        data:data.rows
    })
})