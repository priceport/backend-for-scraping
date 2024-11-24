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

    const statsQuery = await pool.query(`WITH normalized_products AS (
        -- Normalize price per unit for aelia_auckland products
        SELECT 
            p.id AS product_id,
            p.title,
            p.canprod_id,
            pr.price AS flat_price,
            p.qty,
            p.unit,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN pr.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN pr.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN pr.price / NULLIF(p.qty * 1000, 0) -- Convert liters to milliliters
                ELSE NULL
            END AS price_per_unit,
            p.website
        FROM 
            product p
        JOIN 
            price pr ON p.id = pr.product_id
        WHERE 
            p.website = $1
            AND p.canprod_id IS NOT NULL
    ),
    comparison_prices AS (
        -- Normalize price per unit for all other websites
        SELECT 
            mp.product_id AS aelia_product_id,
            mp.price_per_unit AS aelia_price_per_unit,
            mp.flat_price AS aelia_flat_price,
            pr.price AS other_flat_price,
            p.qty AS other_qty,
            p.unit AS other_unit,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN pr.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN pr.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN pr.price / NULLIF(p.qty * 1000, 0) -- Convert liters to milliliters
                ELSE NULL
            END AS other_price_per_unit
        FROM 
            normalized_products mp
        JOIN 
            product p ON p.canprod_id = mp.canprod_id AND p.website != $1
        JOIN 
            price pr ON pr.product_id = p.id
    ),
    product_categories AS (
        -- Ensure mutual exclusivity in categorization
        SELECT 
            np.product_id,
            CASE
                -- Cheapest: No peers are cheaper AND all peers are the same price or more expensive
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM comparison_prices cp
                    WHERE cp.aelia_product_id = np.product_id
                    AND COALESCE(cp.other_price_per_unit, cp.other_flat_price) < COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'cheapest'
                
                -- Expensive: No peers are more expensive AND some peers are cheaper
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM comparison_prices cp
                    WHERE cp.aelia_product_id = np.product_id
                    AND COALESCE(cp.other_price_per_unit, cp.other_flat_price) > COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'expensive'
                
                -- Midrange: Has both cheaper and more expensive peers
                ELSE 'midrange'
            END AS price_category
        FROM 
            normalized_products np
    )
    -- Final aggregation ensuring mutual exclusivity
    SELECT 
        COUNT(DISTINCT np.product_id) AS total_mapped_products,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'cheapest' THEN pc.product_id END) AS cheapest_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'expensive' THEN pc.product_id END) AS expensive_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'midrange' THEN pc.product_id END) AS midrange_count
    FROM 
        normalized_products np
    LEFT JOIN 
        product_categories pc ON np.product_id = pc.product_id;        
    `,[sourceQuery]);

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
            totalProducts:statsQuery?.rows[0]?.total_mapped_products,
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
    const filter = req?.query?.filter;

    if(!sourceQuery){
        return next(
            new AppError("Source param required",400)
        )
    }

    const brandCount = await pool.query(`WITH latest_prices AS (
        -- Select the latest price for each product
        SELECT 
            pr.product_id,
            pr.price,
            pr.date,
            ROW_NUMBER() OVER (PARTITION BY pr.product_id ORDER BY pr.date DESC) AS row_num
        FROM 
            price pr
    ),
    normalized_products AS (
        -- Normalize price per unit for aelia_auckland products using the latest price
        SELECT 
            p.id AS product_id,
            p.title,
            p.canprod_id,
            p.brand,
            p.tag,
            lp.price AS flat_price,
            p.qty,
            p.unit,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN lp.price / NULLIF(p.qty * 1000, 0) -- Convert liters to milliliters
                ELSE NULL
            END AS price_per_unit,
            p.website
        FROM 
            product p
        JOIN 
            latest_prices lp ON p.id = lp.product_id AND lp.row_num = 1
        WHERE 
            p.website = $2
            AND p.canprod_id IS NOT NULL
    ),
    comparison_prices AS (
        -- Normalize price per unit for all other websites using the latest price
        SELECT 
            mp.product_id AS aelia_product_id,
            mp.price_per_unit AS aelia_price_per_unit,
            mp.flat_price AS aelia_flat_price,
            lp.price AS other_flat_price,
            p.qty AS other_qty,
            p.unit AS other_unit,
            p.tag AS other_tag,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN lp.price / NULLIF(p.qty * 1000, 0) -- Convert liters to milliliters
                ELSE NULL
            END AS other_price_per_unit
        FROM 
            normalized_products mp
        JOIN 
            product p ON p.canprod_id = mp.canprod_id 
                AND p.website != $2 -- Avoid self-comparison
        JOIN 
            latest_prices lp ON p.id = lp.product_id AND lp.row_num = 1
        WHERE 
            ($1 = 'all' OR p.tag = $1)
    ),
    product_categories AS (
        SELECT 
            np.product_id,
            np.brand,
            CASE
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM comparison_prices cp
                    WHERE cp.aelia_product_id = np.product_id
                    AND COALESCE(cp.other_price_per_unit, cp.other_flat_price) < COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'cheapest'
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM comparison_prices cp
                    WHERE cp.aelia_product_id = np.product_id
                    AND COALESCE(cp.other_price_per_unit, cp.other_flat_price) > COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'expensive'
                ELSE 'midrange'
            END AS price_category
        FROM 
            normalized_products np
    )
    SELECT 
        pc.brand,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'cheapest' THEN pc.product_id END) AS cheapest_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'expensive' THEN pc.product_id END) AS expensive_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'midrange' THEN pc.product_id END) AS midrange_count
    FROM 
        product_categories pc
    GROUP BY 
        pc.brand
    ORDER BY 
        pc.brand;
    `,[filter,sourceQuery]);

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
    const filter = req?.query?.filter;

    console.log(sourceQuery,filter);

    if(!sourceQuery){
        return next(
            new AppError("Source param required",400)
        )
    }
    const categoryCount = await pool.query(`
    WITH latest_prices AS (
        -- Select the latest price for each product
        SELECT 
            pr.product_id,
            pr.price,
            pr.date,
            ROW_NUMBER() OVER (PARTITION BY pr.product_id ORDER BY pr.date DESC) AS row_num
        FROM 
            price pr
    ),
    normalized_products AS (
        -- Normalize price per unit for aelia_auckland products using the latest price
        SELECT 
            p.id AS product_id,
            p.title,
            p.canprod_id,
            p.category,
            p.tag,
            lp.price AS flat_price,
            p.qty,
            p.unit,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN lp.price / NULLIF(p.qty * 1000, 0) -- Convert liters to milliliters
                ELSE NULL
            END AS price_per_unit,
            p.website
        FROM 
            product p
        JOIN 
            latest_prices lp ON p.id = lp.product_id AND lp.row_num = 1
        WHERE 
            p.website = $2
            AND p.canprod_id IS NOT NULL
    ),
    comparison_prices AS (
        -- Normalize price per unit for all other websites using the latest price
        SELECT 
            mp.product_id AS aelia_product_id,
            mp.price_per_unit AS aelia_price_per_unit,
            mp.flat_price AS aelia_flat_price,
            lp.price AS other_flat_price,
            p.qty AS other_qty,
            p.unit AS other_unit,
            p.tag AS other_tag,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN lp.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN lp.price / NULLIF(p.qty * 1000, 0) -- Convert liters to milliliters
                ELSE NULL
            END AS other_price_per_unit
        FROM 
            normalized_products mp
        JOIN 
            product p ON p.canprod_id = mp.canprod_id 
                AND p.website != $2 -- Avoid self-comparison
        JOIN 
            latest_prices lp ON p.id = lp.product_id AND lp.row_num = 1
        WHERE 
            ($1 = 'all' OR p.tag = $1)
    ),
    product_categories AS (
        SELECT 
            np.product_id,
            np.category,
            CASE
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM comparison_prices cp
                    WHERE cp.aelia_product_id = np.product_id
                    AND COALESCE(cp.other_price_per_unit, cp.other_flat_price) < COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'cheapest'
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM comparison_prices cp
                    WHERE cp.aelia_product_id = np.product_id
                    AND COALESCE(cp.other_price_per_unit, cp.other_flat_price) > COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'expensive'
                ELSE 'midrange'
            END AS price_category
        FROM 
            normalized_products np
    )
    SELECT 
        pc.category,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'cheapest' THEN pc.product_id END) AS cheapest_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'expensive' THEN pc.product_id END) AS expensive_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'midrange' THEN pc.product_id END) AS midrange_count
    FROM 
        product_categories pc
    GROUP BY 
        pc.category
    ORDER BY 
        pc.category;   
`,[filter,sourceQuery])

    return res.status(200).json({
        status:"success",
        message:"Brand stats calculated succesfully",
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

    const data = await pool.query(`WITH latest_prices AS (
        SELECT 
            product_id,
            MAX(date) AS latest_date
        FROM price
        GROUP BY product_id
    ),
    latest_promotions AS (
        SELECT 
            product_id,
            MAX(date) AS latest_date
        FROM promotion
        GROUP BY product_id
    ),
    standardized_products AS (
        SELECT 
            p.id AS product_id,
            p.canprod_id,
            p.website,
            COALESCE(
                CASE 
                    WHEN p.qty IS NULL OR p.qty = 0 THEN NULL
                    WHEN p.unit IN ('ml') THEN lp.price / p.qty
                    WHEN p.unit IN ('l') THEN lp.price / (p.qty * 1000)
                    WHEN p.unit IN ('g') THEN lp.price / p.qty
                    WHEN p.unit IN ('kg') THEN lp.price / (p.qty * 1000)
                    ELSE NULL
                END,
                9999999 -- Treat missing or invalid qty/unit as expensive
            ) AS standardized_price
        FROM 
            product p
        LEFT JOIN 
            latest_prices lp_date ON lp_date.product_id = p.id
        LEFT JOIN 
            price lp ON lp.product_id = p.id AND lp.date = lp_date.latest_date
    ),
    ranked_products AS (
        SELECT 
            sp.canprod_id,
            sp.product_id,
            sp.website,
            sp.standardized_price,
            RANK() OVER (PARTITION BY sp.canprod_id ORDER BY sp.standardized_price ASC) AS pricerank,
            COUNT(*) OVER (PARTITION BY sp.canprod_id) AS total_locations
        FROM 
            standardized_products sp
    ),
    common_products AS (
        SELECT 
            cp.id AS canprod_id,
            p_source.id AS source_product_id,
            rp.pricerank AS source_pricerank,
            rp.standardized_price AS source_price,
            p_other.id AS other_product_id
        FROM 
            cannonical_product cp
        JOIN 
            product p_source ON p_source.canprod_id = cp.id AND p_source.website = $5 -- Dynamic source parameter
        JOIN 
            ranked_products rp ON rp.product_id = p_source.id
        JOIN 
            product p_other ON p_other.canprod_id = cp.id AND p_other.website != $5 -- Exclude source website
        WHERE 
            ($4::int[] IS NULL OR rp.pricerank = ANY($4)) -- Filter by pricerank dynamically
    )
    SELECT 
        cp.canprod_id,
        json_agg(DISTINCT jsonb_build_object(
            'product_id', p.id,
            'title', p.title,
            'brand', p.brand,
            'description', p.description,
            'url', p.url,
            'image_url', p.image_url,
            'qty', p.qty,
            'unit', p.unit,
            'category', p.category,
            'sub_category', p.sub_category,
            'website', p.website,
            'latest_price', lp.price,
            'pricerank', rp.pricerank || '/' || rp.total_locations,
            'latest_promotions', (
                SELECT 
                    json_agg(jsonb_build_object('text', promo.text, 'price', promo.price, 'date', promo.date))
                FROM 
                    promotion promo
                WHERE 
                    promo.product_id = p.id
                    AND promo.date = lp_promo.latest_date
            )
        )) AS products_data,
        MAX(cp.source_pricerank) AS source_pricerank,
        MAX(cp.source_price) AS source_price
    FROM 
        common_products cp
    JOIN 
        product p ON p.canprod_id = cp.canprod_id
    LEFT JOIN 
        latest_prices lp_promo ON lp_promo.product_id = p.id
    LEFT JOIN 
        price lp ON lp.product_id = lp_promo.product_id AND lp.date = lp_promo.latest_date
    LEFT JOIN 
        ranked_products rp ON rp.product_id = p.id
    WHERE 
        ($1::text[] IS NULL OR p.brand = ANY($1)) -- Dynamic brand filter
        AND ($2::text[] IS NULL OR p.category = ANY($2)) -- Dynamic category filter
        AND ($3::text[] IS NULL OR p.website = ANY($3)) -- Dynamic website filter
    GROUP BY 
        cp.canprod_id
    ORDER BY 
        CASE 
            WHEN $8 = 'price_low_to_high' THEN MAX(cp.source_price)
            WHEN $8 = 'pricerank_low_to_high' THEN MAX(cp.source_pricerank)
        END ASC,
        CASE 
            WHEN $8 = 'price_high_to_low' THEN MAX(cp.source_price)
            WHEN $8 = 'pricerank_high_to_low' THEN MAX(cp.source_pricerank)
        END DESC
    LIMIT $6 -- Limit for pagination
    OFFSET $7; -- Offset for pagination         
    `,[brand,category,location,pricerank,source,limit,offset,sort]);


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
    const data = await pool.query(`select distinct brand from product where canprod_id is not null`);

    return res.status(200).json({
        status:"success",
        message:"All brands fetched",
        data:data?.rows
    })
})

exports.getAllLocations = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`select distinct website from product where canprod_id is not null`);

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
