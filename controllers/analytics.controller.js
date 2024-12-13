const pool = require("../configs/postgresql.config");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getCompetetionTrendsData = catchAsync(async (req,res,next)=>{

    const sourceQuery = req?.query?.source;
    const categoryQuery = req?.query?.category?.split(",") || ['beauty','liquor'];

    if(!sourceQuery){
        return next(
            new AppError(`Source query required!`,400)
        )
    }
    const typeData = await pool.query(`
    WITH unique_products AS (
        SELECT 
            DISTINCT ON (ppr.canprod_id, p.tag) 
            ppr.product_id,
            ppr.canprod_id,
            ppr.website,
            ppr.price_rank,
            ppr.total_peers,
            ppr.price_per_unit,
            ppr.date,
            p.tag AS website_type,
            ROW_NUMBER() OVER (PARTITION BY ppr.canprod_id, p.tag ORDER BY ppr.date DESC) AS row_num
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        WHERE 
            ($1::text[] IS NULL OR p.category = ANY($1))
    ),
    filtered_data AS (
        SELECT 
            canprod_id,
            website_type,
            MIN(price_rank) AS min_rank,
            MAX(price_rank) AS max_rank
        FROM 
            unique_products
        WHERE 
            row_num = 1
        GROUP BY 
            canprod_id, website_type
    ),
    labeled_data AS (
        SELECT 
            fd.website_type,
            fd.canprod_id,
            CASE 
                WHEN fd.min_rank = 1 THEN 'cheapest'
                WHEN fd.max_rank = fd.min_rank THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            filtered_data fd
    ),
    type_summary AS (
        SELECT 
            ld.website_type,
            COUNT(DISTINCT ld.canprod_id) AS product_count,
            COUNT(CASE WHEN ld.price_label = 'cheapest' THEN 1 END) AS cheapest_count,
            COUNT(CASE WHEN ld.price_label = 'expensive' THEN 1 END) AS expensive_count,
            COUNT(CASE WHEN ld.price_label = 'midrange' THEN 1 END) AS midrange_count
        FROM 
            labeled_data ld
        GROUP BY 
            ld.website_type
    ),
    type_ranked AS (
        SELECT 
            ts.website_type,
            ts.product_count,
            ts.cheapest_count,
            ts.expensive_count,
            ts.midrange_count,
            ROUND((ts.cheapest_count::NUMERIC / NULLIF(ts.product_count, 0)) * 100, 2) AS percentage_cheapest,
            RANK() OVER (ORDER BY ROUND((ts.cheapest_count::NUMERIC / NULLIF(ts.product_count, 0)) * 100, 2) DESC) AS price_rank
        FROM 
            type_summary ts
    )
    SELECT 
        website_type,
        product_count,
        cheapest_count,
        expensive_count,
        midrange_count,
        percentage_cheapest,
        price_rank
    FROM 
        type_ranked;              
    `,[categoryQuery]);

    const dutyFreeData = await pool.query(`
    WITH latest_data AS (
        SELECT 
            ppr.product_id,
            ppr.canprod_id,
            ppr.website,
            ppr.price_rank,
            ppr.total_peers,
            ppr.price_per_unit,
            ppr.date,
            ROW_NUMBER() OVER (PARTITION BY ppr.canprod_id, ppr.website ORDER BY ppr.date DESC) AS row_num
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        WHERE 
            p.tag = 'duty-free' 
            AND ($1::text[] IS NULL OR p.category = ANY($1))
    ),
    filtered_data AS (
        SELECT 
            product_id,
            canprod_id,
            website,
            price_rank,
            total_peers,
            price_per_unit
        FROM 
            latest_data
        WHERE 
            row_num = 1
    ),
    labeled_data AS (
        SELECT 
            fd.website,
            fd.product_id,
            CASE 
                WHEN fd.price_rank = 1 THEN 'cheapest'
                WHEN fd.price_rank = fd.total_peers THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            filtered_data fd
    ),
    website_summary AS (
        SELECT 
            ld.website,
            COUNT(*) AS product_count,
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
        website_ranked;
  `, [categoryQuery]);

    console.log(dutyFreeData?.rows);

    const domesticData = await pool.query(`WITH latest_data AS (
        SELECT 
            ppr.product_id,
            ppr.canprod_id,
            ppr.website,
            ppr.price_rank,
            ppr.total_peers,
            ppr.price_per_unit,
            ppr.date,
            ROW_NUMBER() OVER (PARTITION BY ppr.canprod_id, ppr.website ORDER BY ppr.date DESC) AS row_num
        FROM 
            product_price_rank ppr
        JOIN 
            product p ON ppr.product_id = p.id
        WHERE 
            p.tag = 'domestic' 
            AND ($1::text[] IS NULL OR p.category = ANY($1))
    ),
    filtered_data AS (
        SELECT 
            product_id,
            canprod_id,
            website,
            price_rank,
            total_peers,
            price_per_unit
        FROM 
            latest_data
        WHERE 
            row_num = 1
    ),
    labeled_data AS (
        SELECT 
            fd.website,
            fd.product_id,
            CASE 
                WHEN fd.price_rank = 1 THEN 'cheapest'
                WHEN fd.price_rank = fd.total_peers THEN 'expensive'
                ELSE 'midrange'
            END AS price_label
        FROM 
            filtered_data fd
    ),
    website_summary AS (
        SELECT 
            ld.website,
            COUNT(*) AS product_count,
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
        website_ranked;   
    `,[categoryQuery]);

    console.log(domesticData?.rows);

    return res.status(200).json({
        status:"success",
        message:"Competetion trends fetched succesfully",
        data:{
            typeComparision:typeData?.rows,
            dutyFreeLocationComparision:dutyFreeData?.rows,
            domesticLocationComparison:domesticData?.rows
        }
    })
});

exports.getTimeTrends = catchAsync(async (req,res,next)=>{
    const { latest_date, past_date, source } = req.query;

    const data = await pool.query(`WITH
    -- Step 1: Identify cheapest prices per mapped product across websites
    cheapest_prices AS (
        SELECT
            p.canprod_id,
            p.category,
            pr.website,
            MIN(pr.price) AS cheapest_price
        FROM
            product p
        JOIN
            price pr ON p.id = pr.product_id
        WHERE
            pr.date IN ($1, $2) -- latest_date and past_date
            AND p.canprod_id IS NOT NULL -- Only include mapped products
        GROUP BY
            p.canprod_id, p.category, pr.website
    ),
    -- Step 2: Calculate the percentage of cheapest products per category and website
    price_rank_data AS (
        SELECT
            cp.website,
            cp.category,
            COUNT(DISTINCT CASE WHEN cp.cheapest_price = (
                SELECT MIN(pr2.price)
                FROM price pr2
                WHERE pr2.product_id = cp.canprod_id
                AND pr2.date = $1 -- latest_date
            ) THEN cp.canprod_id END) AS cheapest_latest_count,
            COUNT(DISTINCT CASE WHEN cp.cheapest_price = (
                SELECT MIN(pr2.price)
                FROM price pr2
                WHERE pr2.product_id = cp.canprod_id
                AND pr2.date = $2 -- past_date
            ) THEN cp.canprod_id END) AS cheapest_past_count,
            COUNT(DISTINCT cp.canprod_id) AS total_products
        FROM
            cheapest_prices cp
        GROUP BY
            cp.website, cp.category
    ),
    -- Step 3: Rank websites based on the percentage of cheapest products
    ranked_data AS (
        SELECT
            prd.category,
            prd.website,
            RANK() OVER (PARTITION BY prd.category ORDER BY (prd.cheapest_latest_count * 1.0 / NULLIF(prd.total_products, 0)) DESC) AS latest_rank,
            RANK() OVER (PARTITION BY prd.category ORDER BY (prd.cheapest_past_count * 1.0 / NULLIF(prd.total_products, 0)) DESC) AS past_rank,
            (prd.cheapest_latest_count * 100.0 / NULLIF(prd.total_products, 0)) AS latest_price_percentage,
            (prd.cheapest_past_count * 100.0 / NULLIF(prd.total_products, 0)) AS past_price_percentage
        FROM
            price_rank_data prd
    ),
    -- Step 4: Fetch brand and product counts for both past and latest dates
    brand_and_product_counts AS (
        SELECT
            p.website,
            p.category,
            COUNT(DISTINCT CASE WHEN pr.date = $1 THEN p.brand END) AS brand_count_latest,
            COUNT(DISTINCT CASE WHEN pr.date = $2 THEN p.brand END) AS brand_count_past,
            COUNT(DISTINCT CASE WHEN pr.date = $1 THEN p.id END) AS product_count_latest,
            COUNT(DISTINCT CASE WHEN pr.date = $2 THEN p.id END) AS product_count_past
        FROM
            product p
        JOIN
            price pr ON p.id = pr.product_id
        WHERE
            pr.date IN ($1, $2)
            AND p.canprod_id IS NOT NULL -- Only include mapped products
        GROUP BY
            p.website, p.category
    ),
    -- Step 5: Aggregate stats across all categories
    aggregated_stats AS (
        SELECT
            'All Categories' AS category,
            r.website,
            AVG(r.latest_price_percentage) AS avg_price_percentage_latest,
            AVG(r.past_price_percentage) AS avg_price_percentage_past,
            SUM(bpc.brand_count_latest) AS total_brands_latest,
            SUM(bpc.brand_count_latest - bpc.brand_count_past) AS total_brand_change,
            SUM(bpc.product_count_latest) AS total_products_latest,
            SUM(bpc.product_count_latest - bpc.product_count_past) AS total_product_change
        FROM
            ranked_data r
        JOIN
            brand_and_product_counts bpc ON r.category = bpc.category AND r.website = bpc.website
        WHERE
            r.website = $3 -- Filter by source
        GROUP BY
            r.website
    ),
    -- Step 6: Final Combined Data
    combined_data AS (
        SELECT
            r.category,
            r.website,
            r.latest_rank AS "Latest Date Price Rank",
            (r.past_rank - r.latest_rank) AS "Price Rank Difference from Past Date",
            bpc.brand_count_latest AS "Latest Date Brands Count",
            (bpc.brand_count_latest - bpc.brand_count_past) AS "Brand Count Change from Past Date",
            bpc.product_count_latest AS "Latest Date Products Count",
            (bpc.product_count_latest - bpc.product_count_past) AS "Product Count Change from Past Date"
        FROM
            ranked_data r
        JOIN
            brand_and_product_counts bpc ON r.category = bpc.category AND r.website = bpc.website
        WHERE
            r.website = $3 -- Filter by source
    )
    SELECT * FROM combined_data
    UNION ALL
    SELECT
        a.category,
        a.website,
        NULL AS "Latest Date Price Rank",
        NULL AS "Price Rank Difference from Past Date",
        a.total_brands_latest AS "Latest Date Brands Count",
        a.total_brand_change AS "Brand Count Change from Past Date",
        a.total_products_latest AS "Latest Date Products Count",
        a.total_product_change AS "Product Count Change from Past Date"
    FROM
        aggregated_stats a;             
    `,[latest_date,past_date,source]);

    const aggregated = await pool.query(`WITH
    -- Step 1: Identify cheapest prices per mapped product across websites
    cheapest_prices AS (
        SELECT
            p.canprod_id,
            pr.website,
            MIN(pr.price) AS cheapest_price
        FROM
            product p
        JOIN
            price pr ON p.id = pr.product_id
        WHERE
            pr.date IN ($1, $2) -- latest_date and past_date
            AND p.canprod_id IS NOT NULL -- Only include mapped products
        GROUP BY
            p.canprod_id, pr.website
    ),
    -- Step 2: Calculate the percentage of cheapest products for each website (all categories combined)
    aggregated_cheapest_data AS (
        SELECT
            cp.website,
            COUNT(DISTINCT CASE WHEN cp.cheapest_price = (
                SELECT MIN(pr2.price)
                FROM price pr2
                WHERE pr2.product_id = cp.canprod_id
                AND pr2.date = $1 -- latest_date
            ) THEN cp.canprod_id END) AS cheapest_latest_count,
            COUNT(DISTINCT CASE WHEN cp.cheapest_price = (
                SELECT MIN(pr2.price)
                FROM price pr2
                WHERE pr2.product_id = cp.canprod_id
                AND pr2.date = $2 -- past_date
            ) THEN cp.canprod_id END) AS cheapest_past_count,
            COUNT(DISTINCT cp.canprod_id) AS total_products
        FROM
            cheapest_prices cp
        GROUP BY
            cp.website
    ),
    -- Step 3: Rank websites based on aggregated percentage of cheapest products
    aggregated_price_ranks AS (
        SELECT
            acd.website,
            RANK() OVER (ORDER BY (acd.cheapest_latest_count * 1.0 / NULLIF(acd.total_products, 0)) DESC) AS latest_rank,
            RANK() OVER (ORDER BY (acd.cheapest_past_count * 1.0 / NULLIF(acd.total_products, 0)) DESC) AS past_rank
        FROM
            aggregated_cheapest_data acd
    ),
    -- Step 4: Fetch brand and product counts for both past and latest dates (all categories combined)
    brand_and_product_counts AS (
        SELECT
            p.website,
            COUNT(DISTINCT CASE WHEN pr.date = $1 THEN p.brand END) AS brand_count_latest,
            COUNT(DISTINCT CASE WHEN pr.date = $2 THEN p.brand END) AS brand_count_past,
            COUNT(DISTINCT CASE WHEN pr.date = $1 THEN p.id END) AS product_count_latest,
            COUNT(DISTINCT CASE WHEN pr.date = $2 THEN p.id END) AS product_count_past
        FROM
            product p
        JOIN
            price pr ON p.id = pr.product_id
        WHERE
            pr.date IN ($1, $2)
            AND p.canprod_id IS NOT NULL -- Only include mapped products
        GROUP BY
            p.website
    ),
    -- Step 5: Combine aggregated stats for "All Categories"
    aggregated_stats AS (
        SELECT
            'All Categories' AS category,
            bpc.website,
            apr.latest_rank AS latest_price_rank,
            (apr.past_rank - apr.latest_rank) AS price_rank_difference,
            bpc.brand_count_latest AS total_brands_latest,
            (bpc.brand_count_latest - bpc.brand_count_past) AS brand_count_change,
            bpc.product_count_latest AS total_products_latest,
            (bpc.product_count_latest - bpc.product_count_past) AS product_count_change
        FROM
            brand_and_product_counts bpc
        JOIN
            aggregated_price_ranks apr ON bpc.website = apr.website
        WHERE
            bpc.website = $3 -- Filter by source
    )
    -- Step 6: Final Combined Data
    SELECT
        'All Categories' AS category,
        website,
        latest_price_rank AS "Latest Date Price Rank",
        price_rank_difference AS "Price Rank Difference from Past Date",
        total_brands_latest AS "Latest Date Brands Count",
        brand_count_change AS "Brand Count Change from Past Date",
        total_products_latest AS "Latest Date Products Count",
        product_count_change AS "Product Count Change from Past Date"
    FROM
        aggregated_stats;    
    `,[latest_date,past_date,source])

    return res.status(200).json({
        status:"success",
        message:"Time trends fetched succesfully",
        data:{
            categories:data?.rows,
            aggregated:aggregated.rows
        }
    })
})

exports.pricePerCategory = catchAsync(async (req,res,next)=>{
    const tags = req?.query?.tags?.split(",") || null;
    const source = req?.query?.source;

    const data = await pool.query(`
    WITH ranked_prices AS (
        -- Step 1: Get the latest price for each product from all websites
        SELECT
            p.id AS product_id,
            p.category,
            p.canprod_id,
            pr.website,
            pr.price / NULLIF(p.qty, 0) AS price_per_unit,
            pr.price AS flat_price,
            p.tag,
            ROW_NUMBER() OVER (PARTITION BY p.id, pr.website ORDER BY pr.date DESC) AS rn
        FROM
            product p
        JOIN
            price pr ON p.id = pr.product_id
        WHERE
            p.canprod_id IS NOT NULL
            AND ($1::TEXT[] IS NULL OR p.tag = ANY($1)) -- Optional tag filter
    ),
    valid_prices AS (
        -- Step 2: Filter to keep only the latest price for each product
        SELECT
            product_id,
            category,
            canprod_id,
            website,
            COALESCE(price_per_unit, flat_price) AS effective_price
        FROM
            ranked_prices
        WHERE
            rn = 1
    ),
    price_ranks AS (
        -- Step 3: Calculate price rank for each product compared to all websites
        SELECT
            vp.product_id,
            vp.category,
            vp.website,
            RANK() OVER (PARTITION BY vp.canprod_id, vp.category ORDER BY vp.effective_price ASC) AS price_rank,
            COUNT(*) OVER (PARTITION BY vp.canprod_id, vp.category) AS total_websites
        FROM
            valid_prices vp
    ),
    source_ranks AS (
        -- Step 4: Get price ranks for the source website
        SELECT
            pr.category,
            pr.price_rank,
            pr.total_websites
        FROM
            price_ranks pr
        WHERE
            pr.website = $2 -- Source website parameterized
    ),
    max_total_websites AS (
        -- Step 5: Compute the maximum number of websites for each category
        SELECT
            category,
            MAX(total_websites) AS max_websites
        FROM
            price_ranks
        GROUP BY
            category
    ),
    all_rank_combinations AS (
        -- Step 6: Generate all possible rank combinations for each category
        SELECT
            mtw.category,
            gs.rank AS price_rank
        FROM
            max_total_websites mtw
        CROSS JOIN generate_series(1, mtw.max_websites) AS gs(rank)
    ),
    category_rank_counts AS (
        -- Step 7: Count products in each rank group by category, ensuring all ranks are represented
        SELECT
            arc.category,
            arc.price_rank,
            COALESCE(SUM(CASE WHEN sr.price_rank = arc.price_rank THEN 1 ELSE 0 END), 0) AS product_count
        FROM
            all_rank_combinations arc
        LEFT JOIN
            source_ranks sr ON arc.category = sr.category AND arc.price_rank = sr.price_rank
        GROUP BY
            arc.category, arc.price_rank
    ),
    rank_array_aggregation AS (
        -- Step 8: Aggregate counts into an array grouped by category
        SELECT
            category,
            ARRAY_AGG(product_count ORDER BY price_rank) AS pricerank_wise_product_count
        FROM
            category_rank_counts
        GROUP BY
            category
    )
    -- Final Output
    SELECT
        category,
        pricerank_wise_product_count
    FROM
        rank_array_aggregation;    
    `,[tags,source]);

    return res.status(200).json({
        status:"success",
        message:"Price per category fetched succesfully",
        data:data?.rows
    })
})

exports.pricePerBrand = catchAsync(async (req,res,next)=>{
    const tags = req?.query?.tags?.split(",") || null;
    const source = req?.query?.source;

    const data = await pool.query(`
    WITH ranked_prices AS (
        -- Step 1: Get the latest price for each product from all websites
        SELECT
            p.id AS product_id,
            p.brand,
            p.canprod_id,
            pr.website,
            pr.price / NULLIF(p.qty, 0) AS price_per_unit,
            pr.price AS flat_price,
            p.tag,
            ROW_NUMBER() OVER (PARTITION BY p.id, pr.website ORDER BY pr.date DESC) AS rn
        FROM
            product p
        JOIN
            price pr ON p.id = pr.product_id
        WHERE
            p.canprod_id IS NOT NULL
            AND ($1::TEXT[] IS NULL OR p.tag = ANY($1)) -- Optional tag filter
    ),
    valid_prices AS (
        -- Step 2: Filter to keep only the latest price for each product
        SELECT
            product_id,
            brand,
            canprod_id,
            website,
            COALESCE(price_per_unit, flat_price) AS effective_price
        FROM
            ranked_prices
        WHERE
            rn = 1
    ),
    price_ranks AS (
        -- Step 3: Calculate price rank for each product compared to all websites
        SELECT
            vp.product_id,
            vp.brand,
            vp.website,
            RANK() OVER (PARTITION BY vp.canprod_id, vp.brand ORDER BY vp.effective_price ASC) AS price_rank,
            COUNT(*) OVER (PARTITION BY vp.canprod_id, vp.brand) AS total_websites
        FROM
            valid_prices vp
    ),
    source_ranks AS (
        -- Step 4: Get price ranks for the source website
        SELECT
            pr.brand,
            pr.price_rank::FLOAT / pr.total_websites AS rank_percentage
        FROM
            price_ranks pr
        WHERE
            pr.website = $2
    ),
    all_rank_combinations AS (
        -- Step 5: Generate all possible rank combinations for each brand
        SELECT
            DISTINCT sr.brand,
            generate_series(1, MAX(pr.total_websites))::FLOAT / MAX(pr.total_websites) AS rank_percentage
        FROM
            source_ranks sr
        JOIN
            price_ranks pr ON sr.brand = pr.brand
        GROUP BY sr.brand
    ),
    brand_rank_counts AS (
        -- Step 6: Count products in each rank group by brand, ensuring all ranks are represented
        SELECT
            arc.brand,
            arc.rank_percentage,
            COALESCE(SUM(CASE WHEN sr.rank_percentage = arc.rank_percentage THEN 1 ELSE 0 END), 0) AS product_count
        FROM
            all_rank_combinations arc
        LEFT JOIN
            source_ranks sr ON arc.brand = sr.brand AND arc.rank_percentage = sr.rank_percentage
        GROUP BY
            arc.brand, arc.rank_percentage
    ),
    rank_array_aggregation AS (
        -- Step 7: Aggregate counts into an array grouped by brand
        SELECT
            brand,
            ARRAY_AGG(product_count ORDER BY rank_percentage) AS pricerank_wise_product_count
        FROM
            brand_rank_counts
        GROUP BY
            brand
    )
    -- Final Output
    SELECT
        brand,
        pricerank_wise_product_count
    FROM
        rank_array_aggregation;
      
    `,[tags,source]);

    return res.status(200).json({
        status:"success",
        message:"Price per brand fetched succesfully",
        data:data?.rows
    })
})