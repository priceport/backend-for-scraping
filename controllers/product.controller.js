const pool = require("../configs/postgresql.config");
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
    const source = req?.query?.source;
    const limit = req?.query?.limit || 50;
    const offset = req?.query?.offset || 0;
    const category = req?.query?.category?.split(",") || null;
    const brand = req?.query?.brand?.split(",") || null;
    const location = req?.query?.location?.split(",") || null;
    const pricerank = req?.query?.pricerank?.split(",")?.map(Number) || null;
    const sort = req?.query?.sort || 'price_low_to_high';

    if(limit > 100){
        return next(
            new AppError("Limit should be equal or less than 100")
        )
    }
    if(!source){
        return next(
            new AppError("Source param required",400)
        )
    }

    const data = await pool.query(`
    WITH latest_promotions AS (
        SELECT
            promo.product_id,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'date', promo.date,
                    'text', promo.text,
                    'price', promo.price
                )
            ) AS promotions
        FROM promotion promo
        WHERE promo.date = (
            SELECT MAX(promo_inner.date)
            FROM promotion promo_inner
            WHERE promo_inner.product_id = promo.product_id
        )
        GROUP BY promo.product_id
    ),
    latest_batch AS (
        SELECT
            pr.canprod_id,
            MAX(pr.date) AS latest_date
        FROM product_price_rank pr
        GROUP BY pr.canprod_id
    ),
    filtered_rank AS (
        SELECT
            pr.*
        FROM product_price_rank pr
        JOIN latest_batch lb ON pr.canprod_id = lb.canprod_id AND pr.date = lb.latest_date
    ),
    source_products AS (
        SELECT
            p.canprod_id,
            pr.product_id,
            pr.website,
            pr.price_rank,
            p.brand,
            p.category,
            pr.date
        FROM product p
        JOIN filtered_rank pr ON p.id = pr.product_id
        WHERE pr.website = $1 -- Source website
          AND ($2::TEXT[] IS NULL OR p.brand = ANY($2))               -- Brand filter (only for source)
          AND ($3::TEXT[] IS NULL OR p.category = ANY($3))            -- Category filter (only for source)
          AND ($4::INT[] IS NULL OR pr.price_rank = ANY($4))          -- Price rank filter (only for source)
    )
    SELECT 
        cp.id AS canprod_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'qty', p.qty,
                'url', p.url,
                'unit', p.unit,
                'brand', p.brand,
                'title', p.title,
                'website', pr.website,
                'category', p.category,
                'image_url', p.image_url,
                'pricerank', CONCAT(pr.price_rank, '/', pr.total_peers),
                'product_id', p.id,
                'description', COALESCE(p.description, 'No desc'),
                'latest_price', pr.price,
                'sub_category', p.sub_category,
                'latest_promotions', COALESCE(lp.promotions, '[]'::JSON)
            )
        ) AS products_data,
        MAX(CASE WHEN pr.website = $1 THEN pr.price_rank END) AS source_pricerank,
        MAX(CASE WHEN pr.website = $1 THEN pr.price END) AS source_price
    FROM 
        cannonical_product cp
    JOIN 
        product p ON cp.id = p.canprod_id
    JOIN 
        filtered_rank pr ON p.id = pr.product_id
    LEFT JOIN 
        latest_promotions lp ON lp.product_id = p.id
    JOIN 
        source_products sp ON sp.canprod_id = p.canprod_id 
                          AND sp.date = pr.date -- Ensure peers belong to the same batch as the source
    WHERE 
        p.canprod_id IS NOT NULL
        AND ($5::TEXT[] IS NULL OR pr.website = ANY($5)) -- Location filter (applies to all products)
    GROUP BY 
        cp.id
    ORDER BY 
        CASE 
            WHEN $6 = 'price_low_to_high' OR $6 IS NULL THEN MAX(CASE WHEN pr.website = $1 THEN pr.price END)
            WHEN $6 = 'pricerank_low_to_high' THEN MAX(CASE WHEN pr.website = $1 THEN pr.price_rank END)
        END ASC,
        CASE 
            WHEN $6 = 'price_high_to_low' THEN MAX(CASE WHEN pr.website = $1 THEN pr.price END)
            WHEN $6 = 'pricerank_high_to_low' THEN MAX(CASE WHEN pr.website = $1 THEN pr.price_rank END)
        END DESC NULLS LAST
    LIMIT $7 OFFSET $8;    
`, [source, brand, category, pricerank, location, sort, limit, offset]);

    return res.status(200).json({
        status:"success",
        message:"All products for "+source+" fetched",
        data:data.rows
    })

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

    console.log(req?.query);
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
