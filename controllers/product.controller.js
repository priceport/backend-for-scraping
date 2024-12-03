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

    const statsQuery = await pool.query(`select * from daily_price_stats where date in (select max(date) from daily_price_stats) and website = $1;`,[sourceQuery]);

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
    source_batch AS (
        SELECT
            p.canprod_id,
            pr.date,
            pr.total_peers
        FROM product_price_rank pr
        JOIN product p ON p.id = pr.product_id
        WHERE pr.website = $1 -- Filter for the source website
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
                'website', p.website,
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
        product_price_rank pr ON p.id = pr.product_id
    LEFT JOIN 
        latest_promotions lp ON lp.product_id = p.id
    JOIN 
        source_batch sb ON sb.canprod_id = p.canprod_id 
                       AND sb.date = pr.date 
                       AND sb.total_peers = pr.total_peers -- Match total_peers to filter non-batched locations
    WHERE 
        p.canprod_id IN (
            SELECT canprod_id
            FROM source_batch -- Ensure source website is part of the batch
        )
        AND ($2::TEXT[] IS NULL OR p.brand = ANY($2))                  -- Brand filter (array of brands)
        AND ($3::TEXT[] IS NULL OR p.category = ANY($3))               -- Category filter (array of categories)
        AND ($4::INT[] IS NULL OR pr.price_rank = ANY($4))             -- Price rank filter (array of ranks)
        AND ($5::TEXT[] IS NULL OR pr.website = ANY($5))               -- Location filter (array of locations)
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

    const data = await pool.query(` WITH latest_promotions AS (
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
    source_batch AS (
        SELECT
            p.canprod_id,
            pr.date,
            pr.total_peers
        FROM product_price_rank pr
        JOIN product p ON p.id = pr.product_id
        WHERE pr.website = $1 -- Filter for the source website
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
                'website', p.website,
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
        product_price_rank pr ON p.id = pr.product_id
    LEFT JOIN 
        latest_promotions lp ON lp.product_id = p.id
    JOIN 
        source_batch sb ON sb.canprod_id = p.canprod_id 
                       AND sb.date = pr.date 
                       AND sb.total_peers = pr.total_peers -- Match total_peers to filter non-batched locations
    WHERE 
        p.canprod_id IS NOT NULL
        AND ($2::TEXT[] IS NULL OR p.brand = ANY($2))                  -- Brand filter (array of brands)
        AND ($3::TEXT[] IS NULL OR p.category = ANY($3))               -- Category filter (array of categories)
        AND ($4::INT[] IS NULL OR pr.price_rank = ANY($4))             -- Price rank filter (array of ranks)
        AND ($5::TEXT[] IS NULL OR pr.website = ANY($5))               -- Location filter (array of locations)
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
    
    `,[source,brand,category,pricerank,location,sort,limit,offset]);

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
