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

    const sourceTable = source[sourceQuery];

    const totalProducts = await pool.query(`WITH mapped_products AS (
        SELECT
            cp.id AS canprod_id
        FROM
            cannonical_product cp
        JOIN
            product_from_${sourceTable} pa ON cp.id = pa.canprod_id
        WHERE
            pa.canprod_id IS NOT NULL
    )
    SELECT
        COUNT(DISTINCT mapped_products.canprod_id) AS mapped_count
    FROM
        mapped_products;
    `);

    const cheapestProducts = await pool.query(`WITH ranked_prices AS (
        -- Rank the prices per product by source and date to get the latest price
        SELECT
            pa.canprod_id,
            pfa.prod_id,
            pfa.price / NULLIF(COALESCE(pa.qty, 1),0) AS price_per_unit, -- price per unit (adjusted for qty)
            pfa.price AS absolute_price,
            'auckland' AS source,
            ROW_NUMBER() OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date DESC) AS price_rank
        FROM
            price_from_aelia_auckland pfa
        JOIN
            product_from_aelia_auckland pa ON pa.id = pfa.prod_id
    
        UNION ALL
    
        SELECT
            pq.canprod_id,
            pfq.prod_id,
            pfq.price / NULLIF(COALESCE(pq.qty, 1),0) AS price_per_unit,
            pfq.price AS absolute_price,
            'queenstown' AS source,
            ROW_NUMBER() OVER (PARTITION BY pfq.prod_id ORDER BY pfq.date DESC) AS price_rank
        FROM
            price_from_aelia_queensland pfq
        JOIN
            product_from_aelia_queensland pq ON pq.id = pfq.prod_id
    
        UNION ALL
    
        SELECT
            pc.canprod_id,
            pfc.prod_id,
            pfc.price / NULLIF(COALESCE(pc.qty, 1),0) AS price_per_unit,
            pfc.price AS absolute_price,
            'christchurch' AS source,
            ROW_NUMBER() OVER (PARTITION BY pfc.prod_id ORDER BY pfc.date DESC) AS price_rank
        FROM
            price_from_aelia_christchurch pfc
        JOIN
            product_from_aelia_christchurch pc ON pc.id = pfc.prod_id

        UNION ALL
    
        SELECT
            ps.canprod_id,
            phs.prod_id,
            phs.price / NULLIF(COALESCE(ps.qty, 1),0) AS price_per_unit,
            phs.price AS absolute_price,
            'sydney' AS source,
            ROW_NUMBER() OVER (PARTITION BY phs.prod_id ORDER BY phs.date DESC) AS price_rank
        FROM
            price_from_heinemann_sydney phs
        JOIN
            product_from_heinemann_sydney ps ON ps.id = phs.prod_id

        UNION ALL
    
        SELECT
            pb.canprod_id,
            plb.prod_id,
            plb.price / NULLIF(COALESCE(pb.qty, 1),0) AS price_per_unit,
            plb.price AS absolute_price,
            'brisbane' AS source,
            ROW_NUMBER() OVER (PARTITION BY plb.prod_id ORDER BY plb.date DESC) AS price_rank
        FROM
            price_from_lotte_brisbane plb
        JOIN
            product_from_lotte_brisbane pb ON pb.id = plb.prod_id

        UNION ALL
    
        SELECT
            pm.canprod_id,
            plm.prod_id,
            plm.price / NULLIF(COALESCE(pm.qty, 1),0) AS price_per_unit,
            plm.price AS absolute_price,
            'melbourne' AS source,
            ROW_NUMBER() OVER (PARTITION BY plm.prod_id ORDER BY plm.date DESC) AS price_rank
        FROM
            price_from_lotte_melbourne plm
        JOIN
            product_from_lotte_melbourne pm ON pm.id = plm.prod_id

        UNION ALL
    
        SELECT
            pb2.canprod_id,
            pbb.prod_id,
            pbb.price / NULLIF(COALESCE(pb2.qty, 1),0) AS price_per_unit,
            pbb.price AS absolute_price,
            'beauty_bliss' AS source,
            ROW_NUMBER() OVER (PARTITION BY pbb.prod_id ORDER BY pbb.date DESC) AS price_rank
        FROM
            price_from_beauty_bliss pbb
        JOIN
            product_from_beauty_bliss pb2 ON pb2.id = pbb.prod_id

        UNION ALL
    
        SELECT
            pb3.canprod_id,
            pbb2.prod_id,
            pbb2.price / NULLIF(COALESCE(pb3.qty, 1),0) AS price_per_unit,
            pbb2.price AS absolute_price,
            'big_barrel' AS source,
            ROW_NUMBER() OVER (PARTITION BY pbb2.prod_id ORDER BY pbb2.date DESC) AS price_rank
        FROM
            price_from_big_barrel pbb2
        JOIN
            product_from_big_barrel pb3 ON pb3.id = pbb2.prod_id

        UNION ALL
    
        SELECT
            pw.canprod_id,
            pwh.prod_id,
            pwh.price / NULLIF(COALESCE(pw.qty, 1),0) AS price_per_unit,
            pwh.price AS absolute_price,
            'chemist_warehouse' AS source,
            ROW_NUMBER() OVER (PARTITION BY pwh.prod_id ORDER BY pwh.date DESC) AS price_rank
        FROM
            price_from_chemist_warehouse pwh
        JOIN
            product_from_chemist_warehouse pw ON pw.id = pwh.prod_id
        
        UNION ALL
    
        SELECT
            ppf.canprod_id,
            pf.prod_id,
            pf.price / NULLIF(COALESCE(ppf.qty, 1),0) AS price_per_unit,
            pf.price AS absolute_price,
            'farmers' AS source,
            ROW_NUMBER() OVER (PARTITION BY pf.prod_id ORDER BY pf.date DESC) AS price_rank
        FROM
            price_from_farmers pf
        JOIN
            product_from_farmers ppf ON ppf.id = pf.prod_id

        UNION ALL
    
        SELECT
            ppm2.canprod_id,
            pm2.prod_id,
            pm2.price / NULLIF(COALESCE(ppm2.qty, 1),0) AS price_per_unit,
            pm2.price AS absolute_price,
            'mecca' AS source,
            ROW_NUMBER() OVER (PARTITION BY pm2.prod_id ORDER BY pm2.date DESC) AS price_rank
        FROM
            price_from_mecca pm2
        JOIN
            product_from_mecca ppm2 ON ppm2.id = pm2.prod_id

        UNION ALL
    
        SELECT
            pps2.canprod_id,
            ps2.prod_id,
            ps2.price / NULLIF(COALESCE(pps2.qty, 1),0) AS price_per_unit,
            ps2.price AS absolute_price,
            'sephora' AS source,
            ROW_NUMBER() OVER (PARTITION BY ps2.prod_id ORDER BY ps2.date DESC) AS price_rank
        FROM
            price_from_mecca ps2
        JOIN
            product_from_mecca pps2 ON pps2.id = ps2.prod_id

        UNION ALL
    
        SELECT
            ppz.canprod_id,
            pz.prod_id,
            pz.price / NULLIF(COALESCE(ppz.qty, 1),0) AS price_per_unit,
            pz.price AS absolute_price,
            'nz_liquor' AS source,
            ROW_NUMBER() OVER (PARTITION BY pz.prod_id ORDER BY pz.date DESC) AS price_rank
        FROM
            price_from_nzliquor pz
        JOIN
            product_from_nzliquor ppz ON ppz.id = pz.prod_id

        UNION ALL
    
        SELECT
            ppwam.canprod_id,
            pwam.prod_id,
            pwam.price / NULLIF(COALESCE(ppwam.qty, 1),0) AS price_per_unit,
            pwam.price AS absolute_price,
            'whisky_and_more' AS source,
            ROW_NUMBER() OVER (PARTITION BY pwam.prod_id ORDER BY pwam.date DESC) AS price_rank
        FROM
            price_from_whisky_and_more pwam
        JOIN
            product_from_whisky_and_more ppwam ON ppwam.id = pwam.prod_id
    ),
    latest_prices AS (
        -- Filter to only keep the latest price entry per product for each source
        SELECT
            rp.canprod_id,
            rp.price_per_unit,
            rp.absolute_price,
            rp.source
        FROM
            ranked_prices rp
        WHERE
            rp.price_rank = 1
    ),
    price_ranges AS (
        -- Determine the minimum and maximum price per unit for each canonical product across all sources
        SELECT
            canprod_id,
            MIN(price_per_unit) AS min_price_per_unit,
            MAX(price_per_unit) AS max_price_per_unit
        FROM
            latest_prices
        GROUP BY
            canprod_id
    ),
    classified_prices AS (
        -- Classify products as cheapest, midrange, or expensive based on their price per unit
        SELECT
            lp.canprod_id,
            lp.price_per_unit,
            lp.source,
            pr.min_price_per_unit,
            pr.max_price_per_unit,
            CASE
                WHEN lp.price_per_unit = pr.min_price_per_unit THEN 'cheapest'
                WHEN lp.price_per_unit = pr.max_price_per_unit THEN 'expensive'
                ELSE 'midrange'
            END AS price_class
        FROM
            latest_prices lp
        JOIN
            price_ranges pr ON lp.canprod_id = pr.canprod_id
    )
    -- Count the number of products in each price class for Auckland
    SELECT
        COUNT(DISTINCT CASE WHEN price_class = 'cheapest' THEN cp.canprod_id END) AS cheapest_count,
        COUNT(DISTINCT CASE WHEN price_class = 'expensive' THEN cp.canprod_id END) AS expensive_count,
        COUNT(DISTINCT CASE WHEN price_class = 'midrange' THEN cp.canprod_id END) AS midrange_count
    FROM
        classified_prices cp
    WHERE
        cp.source = $1;
    `,[sourceQuery]);

    const distinctCount = await pool.query(`
    SELECT
    COUNT(DISTINCT pa.brand) AS distinct_brands,
        COUNT(DISTINCT pa.category) AS distinct_categories
    FROM
        product_from_aelia_auckland pa
    JOIN
        cannonical_product cp ON pa.canprod_id = cp.id;
    `);

    return res.status(200).json({
        status:"success",
        message:"Stats calculated succesfully",
        data:{
            totalProducts:totalProducts?.rows[0]?.mapped_count,
            cheapestProducts:cheapestProducts?.rows[0]?.cheapest_count,
            midrangeProducts:cheapestProducts?.rows[0]?.midrange_count,
            expensiveProducts:cheapestProducts?.rows[0]?.expensive_count,
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

    const obj = {
        auckland:`SELECT
        pa.canprod_id,
        pa.category,
        pa.brand,
        pfa.prod_id,
        pfa.price / NULLIF(COALESCE(pa.qty, 1),0) AS price_per_unit, -- price per unit (adjusted for qty)
        pfa.price AS absolute_price,
        'auckland' AS source,
        ROW_NUMBER() OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date DESC) AS price_rank
    FROM
        price_from_aelia_auckland pfa
    JOIN
        product_from_aelia_auckland pa ON pa.id = pfa.prod_id`,
        queenstown:`SELECT
        pq.canprod_id,
        pq.category,
        pq.brand,
        pfq.prod_id,
        pfq.price / NULLIF(COALESCE(pq.qty, 1),0) AS price_per_unit,
        pfq.price AS absolute_price,
        'queenstown' AS source,
        ROW_NUMBER() OVER (PARTITION BY pfq.prod_id ORDER BY pfq.date DESC) AS price_rank
    FROM
        price_from_aelia_queensland pfq
    JOIN
        product_from_aelia_queensland pq ON pq.id = pfq.prod_id`,
        sydney:`SELECT
        ps.canprod_id,
        ps.category,
        ps.brand,
        phs.prod_id,
        phs.price / NULLIF(COALESCE(ps.qty, 1),0) AS price_per_unit,
        phs.price AS absolute_price,
        'sydney' AS source,
        ROW_NUMBER() OVER (PARTITION BY phs.prod_id ORDER BY phs.date DESC) AS price_rank
    FROM
        price_from_heinemann_sydney phs
    JOIN
        product_from_heinemann_sydney ps ON ps.id = phs.prod_ids`,
        brisbane:`SELECT
        pb.canprod_id,
        pb.category,
        pb.brand,
        plb.prod_id,
        plb.price / NULLIF(COALESCE(pb.qty, 1),0) AS price_per_unit,
        plb.price AS absolute_price,
        'brisbane' AS source,
        ROW_NUMBER() OVER (PARTITION BY plb.prod_id ORDER BY plb.date DESC) AS price_rank
    FROM
        price_from_lotte_brisbane plb
    JOIN
        product_from_lotte_brisbane pb ON pb.id = plb.prod_id`,
        melbourne:`SELECT
        pm.canprod_id,
        pm.category,
        pm.brand,
        plm.prod_id,
        plm.price / NULLIF(COALESCE(pm.qty, 1),0) AS price_per_unit,
        plm.price AS absolute_price,
        'melbourne' AS source,
        ROW_NUMBER() OVER (PARTITION BY plm.prod_id ORDER BY plm.date DESC) AS price_rank
    FROM
        price_from_lotte_melbourne plm
    JOIN
        product_from_lotte_melbourne pm ON pm.id = plm.prod_ids`
    }
    const duty_free = `SELECT
    pa.canprod_id,
    pa.category,
    pa.brand,
    pfa.prod_id,
    pfa.price / NULLIF(COALESCE(pa.qty, 1),0) AS price_per_unit, -- price per unit (adjusted for qty)
    pfa.price AS absolute_price,
    'auckland' AS source,
    ROW_NUMBER() OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date DESC) AS price_rank
FROM
    price_from_aelia_auckland pfa
JOIN
    product_from_aelia_auckland pa ON pa.id = pfa.prod_id

UNION ALL

SELECT
    pq.canprod_id,
    pq.category,
    pq.brand,
    pfq.prod_id,
    pfq.price / NULLIF(COALESCE(pq.qty, 1),0) AS price_per_unit,
    pfq.price AS absolute_price,
    'queenstown' AS source,
    ROW_NUMBER() OVER (PARTITION BY pfq.prod_id ORDER BY pfq.date DESC) AS price_rank
FROM
    price_from_aelia_queensland pfq
JOIN
    product_from_aelia_queensland pq ON pq.id = pfq.prod_id

UNION ALL

SELECT
    pc.canprod_id,
    pc.category,
    pc.brand,
    pfc.prod_id,
    pfc.price / NULLIF(COALESCE(pc.qty, 1),0) AS price_per_unit,
    pfc.price AS absolute_price,
    'christchurch' AS source,
    ROW_NUMBER() OVER (PARTITION BY pfc.prod_id ORDER BY pfc.date DESC) AS price_rank
FROM
    price_from_aelia_christchurch pfc
JOIN
    product_from_aelia_christchurch pc ON pc.id = pfc.prod_id

UNION ALL

SELECT
    ps.canprod_id,
    ps.category,
    ps.brand,
    phs.prod_id,
    phs.price / NULLIF(COALESCE(ps.qty, 1),0) AS price_per_unit,
    phs.price AS absolute_price,
    'sydney' AS source,
    ROW_NUMBER() OVER (PARTITION BY phs.prod_id ORDER BY phs.date DESC) AS price_rank
FROM
    price_from_heinemann_sydney phs
JOIN
    product_from_heinemann_sydney ps ON ps.id = phs.prod_id

UNION ALL

SELECT
    pb.canprod_id,
    pb.category,
    pb.brand,
    plb.prod_id,
    plb.price / NULLIF(COALESCE(pb.qty, 1),0) AS price_per_unit,
    plb.price AS absolute_price,
    'brisbane' AS source,
    ROW_NUMBER() OVER (PARTITION BY plb.prod_id ORDER BY plb.date DESC) AS price_rank
FROM
    price_from_lotte_brisbane plb
JOIN
    product_from_lotte_brisbane pb ON pb.id = plb.prod_id

UNION ALL

SELECT
    pm.canprod_id,
    pm.category,
    pm.brand,
    plm.prod_id,
    plm.price / NULLIF(COALESCE(pm.qty, 1),0) AS price_per_unit,
    plm.price AS absolute_price,
    'melbourne' AS source,
    ROW_NUMBER() OVER (PARTITION BY plm.prod_id ORDER BY plm.date DESC) AS price_rank
FROM
    price_from_lotte_melbourne plm
JOIN
    product_from_lotte_melbourne pm ON pm.id = plm.prod_id`;

    const domestic = `SELECT
    pb2.canprod_id,
    pb2.category,
    pb2.brand,
    pbb.prod_id,
    pbb.price / NULLIF(COALESCE(pb2.qty, 1),0) AS price_per_unit,
    pbb.price AS absolute_price,
    'beauty_bliss' AS source,
    ROW_NUMBER() OVER (PARTITION BY pbb.prod_id ORDER BY pbb.date DESC) AS price_rank
FROM
    price_from_beauty_bliss pbb
JOIN
    product_from_beauty_bliss pb2 ON pb2.id = pbb.prod_id

UNION ALL

SELECT
    pb3.canprod_id,
    pb3.category,
    pb3.brand,
    pbb2.prod_id,
    pbb2.price / NULLIF(COALESCE(pb3.qty, 1),0) AS price_per_unit,
    pbb2.price AS absolute_price,
    'big_barrel' AS source,
    ROW_NUMBER() OVER (PARTITION BY pbb2.prod_id ORDER BY pbb2.date DESC) AS price_rank
FROM
    price_from_big_barrel pbb2
JOIN
    product_from_big_barrel pb3 ON pb3.id = pbb2.prod_id

UNION ALL

SELECT
    pw.canprod_id,
    pw.category,
    pw.brand,
    pwh.prod_id,
    pwh.price / NULLIF(COALESCE(pw.qty, 1),0) AS price_per_unit,
    pwh.price AS absolute_price,
    'chemist_warehouse' AS source,
    ROW_NUMBER() OVER (PARTITION BY pwh.prod_id ORDER BY pwh.date DESC) AS price_rank
FROM
    price_from_chemist_warehouse pwh
JOIN
    product_from_chemist_warehouse pw ON pw.id = pwh.prod_id

UNION ALL

SELECT
    ppf.canprod_id,
    ppf.category,
    ppf.brand,
    pf.prod_id,
    pf.price / NULLIF(COALESCE(ppf.qty, 1),0) AS price_per_unit,
    pf.price AS absolute_price,
    'farmers' AS source,
    ROW_NUMBER() OVER (PARTITION BY pf.prod_id ORDER BY pf.date DESC) AS price_rank
FROM
    price_from_farmers pf
JOIN
    product_from_farmers ppf ON ppf.id = pf.prod_id

UNION ALL

SELECT
    ppm2.canprod_id,
    ppm2.category,
    ppm2.brand,
    pm2.prod_id,
    pm2.price / NULLIF(COALESCE(ppm2.qty, 1),0) AS price_per_unit,
    pm2.price AS absolute_price,
    'mecca' AS source,
    ROW_NUMBER() OVER (PARTITION BY pm2.prod_id ORDER BY pm2.date DESC) AS price_rank
FROM
    price_from_mecca pm2
JOIN
    product_from_mecca ppm2 ON ppm2.id = pm2.prod_id

UNION ALL

SELECT
    pps2.canprod_id,
    pps2.category,
    pps2.brand,
    ps2.prod_id,
    ps2.price / NULLIF(COALESCE(pps2.qty, 1),0) AS price_per_unit,
    ps2.price AS absolute_price,
    'sephora' AS source,
    ROW_NUMBER() OVER (PARTITION BY ps2.prod_id ORDER BY ps2.date DESC) AS price_rank
FROM
    price_from_mecca ps2
JOIN
    product_from_mecca pps2 ON pps2.id = ps2.prod_id

UNION ALL

SELECT
    ppz.canprod_id,
    ppz.category,
    ppz.brand,
    pz.prod_id,
    pz.price / NULLIF(COALESCE(ppz.qty, 1),0) AS price_per_unit,
    pz.price AS absolute_price,
    'nz_liquor' AS source,
    ROW_NUMBER() OVER (PARTITION BY pz.prod_id ORDER BY pz.date DESC) AS price_rank
FROM
    price_from_nzliquor pz
JOIN
    product_from_nzliquor ppz ON ppz.id = pz.prod_id

UNION ALL

SELECT
    ppwam.canprod_id,
    ppwam.category,
    ppwam.brand,
    pwam.prod_id,
    pwam.price / NULLIF(COALESCE(ppwam.qty, 1),0) AS price_per_unit,
    pwam.price AS absolute_price,
    'whisky_and_more' AS source,
    ROW_NUMBER() OVER (PARTITION BY pwam.prod_id ORDER BY pwam.date DESC) AS price_rank
FROM
    price_from_whisky_and_more pwam
JOIN
    product_from_whisky_and_more ppwam ON ppwam.id = pwam.prod_id`;

    if(!filter||filter=="all"){
        query=`${duty_free} UNION ALL ${domestic}`;
    }
    else if(filter=="duty-free"){
        query=duty_free;
    }
    else{
        query=`${obj[sourceQuery]} UNION ALL ${domestic}`;
    }

    const brand = await pool.query(`WITH ranked_prices AS (
        -- Rank the prices per product by source and date to get the latest price
        ${query}       
    ),
    latest_prices AS (
        -- Filter to only keep the latest price entry per product for each source
        SELECT
            rp.canprod_id,
            rp.category,
            rp.brand,
            rp.price_per_unit,
            rp.absolute_price,
            rp.source
        FROM
            ranked_prices rp
        WHERE
            rp.price_rank = 1
    ),
    price_ranges AS (
        -- Determine the minimum and maximum price per unit for each canonical product across all sources
        SELECT
            canprod_id,
            MIN(price_per_unit) AS min_price_per_unit,
            MAX(price_per_unit) AS max_price_per_unit
        FROM
            latest_prices
        GROUP BY
            canprod_id
    ),
    classified_prices AS (
        -- Classify products as cheapest, midrange, or expensive based on their price per unit
        SELECT
            lp.canprod_id,
            lp.category,
            lp.brand,
            lp.price_per_unit,
            lp.source,
            pr.min_price_per_unit,
            pr.max_price_per_unit,
            CASE
                WHEN lp.price_per_unit = pr.min_price_per_unit THEN 'cheapest'
                WHEN lp.price_per_unit = pr.max_price_per_unit THEN 'expensive'
                ELSE 'midrange'
            END AS price_class
        FROM
            latest_prices lp
        JOIN
            price_ranges pr ON lp.canprod_id = pr.canprod_id
    )
    SELECT
    cp.brand,
    COUNT(DISTINCT CASE WHEN price_class = 'cheapest' THEN cp.canprod_id END) AS cheapest_count,
    COUNT(DISTINCT CASE WHEN price_class = 'expensive' THEN cp.canprod_id END) AS expensive_count,
    COUNT(DISTINCT CASE WHEN price_class = 'midrange' THEN cp.canprod_id END) AS midrange_count
FROM
    classified_prices cp
WHERE
    cp.source = $1
GROUP BY
    cp.brand
ORDER BY
    cp.brand;
    `,[sourceQuery]);

    return res.status(200).json({
        status:"success",
        message:"Brand stats calculated succesfully",
        data:{
            brandData:brand.rows
        }
    })
})

exports.getCategoryStatsFor = catchAsync(async (req,res,next)=>{

    const sourceQuery = req?.query?.source;
    const filter = req?.query?.filter;

    if(!sourceQuery){
        return next(
            new AppError("Source param required",400)
        )
    }

    const duty_free=`SELECT
    pa.canprod_id,
    pa.category,
    pa.brand,
    pfa.prod_id,
    pfa.price / NULLIF(COALESCE(pa.qty, 1),0) AS price_per_unit, -- price per unit (adjusted for qty)
    pfa.price AS absolute_price,
    'auckland' AS source,
    ROW_NUMBER() OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date DESC) AS price_rank
FROM
    price_from_aelia_auckland pfa
JOIN
    product_from_aelia_auckland pa ON pa.id = pfa.prod_id

UNION ALL

SELECT
    pq.canprod_id,
    pq.category,
    pq.brand,
    pfq.prod_id,
    pfq.price / NULLIF(COALESCE(pq.qty, 1),0) AS price_per_unit,
    pfq.price AS absolute_price,
    'queenstown' AS source,
    ROW_NUMBER() OVER (PARTITION BY pfq.prod_id ORDER BY pfq.date DESC) AS price_rank
FROM
    price_from_aelia_queensland pfq
JOIN
    product_from_aelia_queensland pq ON pq.id = pfq.prod_id

UNION ALL

SELECT
    pc.canprod_id,
    pc.category,
    pc.brand,
    pfc.prod_id,
    pfc.price / NULLIF(COALESCE(pc.qty, 1),0) AS price_per_unit,
    pfc.price AS absolute_price,
    'christchurch' AS source,
    ROW_NUMBER() OVER (PARTITION BY pfc.prod_id ORDER BY pfc.date DESC) AS price_rank
FROM
    price_from_aelia_christchurch pfc
JOIN
    product_from_aelia_christchurch pc ON pc.id = pfc.prod_id

UNION ALL

SELECT
    ps.canprod_id,
    ps.category,
    ps.brand,
    phs.prod_id,
    phs.price / NULLIF(COALESCE(ps.qty, 1),0) AS price_per_unit,
    phs.price AS absolute_price,
    'sydney' AS source,
    ROW_NUMBER() OVER (PARTITION BY phs.prod_id ORDER BY phs.date DESC) AS price_rank
FROM
    price_from_heinemann_sydney phs
JOIN
    product_from_heinemann_sydney ps ON ps.id = phs.prod_id

UNION ALL

SELECT
    pb.canprod_id,
    pb.category,
    pb.brand,
    plb.prod_id,
    plb.price / NULLIF(COALESCE(pb.qty, 1),0) AS price_per_unit,
    plb.price AS absolute_price,
    'brisbane' AS source,
    ROW_NUMBER() OVER (PARTITION BY plb.prod_id ORDER BY plb.date DESC) AS price_rank
FROM
    price_from_lotte_brisbane plb
JOIN
    product_from_lotte_brisbane pb ON pb.id = plb.prod_id

UNION ALL

SELECT
    pm.canprod_id,
    pm.category,
    pm.brand,
    plm.prod_id,
    plm.price / NULLIF(COALESCE(pm.qty, 1),0) AS price_per_unit,
    plm.price AS absolute_price,
    'melbourne' AS source,
    ROW_NUMBER() OVER (PARTITION BY plm.prod_id ORDER BY plm.date DESC) AS price_rank
FROM
    price_from_lotte_melbourne plm
JOIN
    product_from_lotte_melbourne pm ON pm.id = plm.prod_id`;

    const domestic = `SELECT
    pb2.canprod_id,
    pb2.category,
    pb2.brand,
    pbb.prod_id,
    pbb.price / NULLIF(COALESCE(pb2.qty, 1),0) AS price_per_unit,
    pbb.price AS absolute_price,
    'beauty_bliss' AS source,
    ROW_NUMBER() OVER (PARTITION BY pbb.prod_id ORDER BY pbb.date DESC) AS price_rank
FROM
    price_from_beauty_bliss pbb
JOIN
    product_from_beauty_bliss pb2 ON pb2.id = pbb.prod_id

UNION ALL

SELECT
    pb3.canprod_id,
    pb3.category,
    pb3.brand,
    pbb2.prod_id,
    pbb2.price / NULLIF(COALESCE(pb3.qty, 1),0) AS price_per_unit,
    pbb2.price AS absolute_price,
    'big_barrel' AS source,
    ROW_NUMBER() OVER (PARTITION BY pbb2.prod_id ORDER BY pbb2.date DESC) AS price_rank
FROM
    price_from_big_barrel pbb2
JOIN
    product_from_big_barrel pb3 ON pb3.id = pbb2.prod_id

UNION ALL

SELECT
    pw.canprod_id,
    pw.category,
    pw.brand,
    pwh.prod_id,
    pwh.price / NULLIF(COALESCE(pw.qty, 1),0) AS price_per_unit,
    pwh.price AS absolute_price,
    'chemist_warehouse' AS source,
    ROW_NUMBER() OVER (PARTITION BY pwh.prod_id ORDER BY pwh.date DESC) AS price_rank
FROM
    price_from_chemist_warehouse pwh
JOIN
    product_from_chemist_warehouse pw ON pw.id = pwh.prod_id

UNION ALL

SELECT
    ppf.canprod_id,
    ppf.category,
    ppf.brand,
    pf.prod_id,
    pf.price / NULLIF(COALESCE(ppf.qty, 1),0) AS price_per_unit,
    pf.price AS absolute_price,
    'farmers' AS source,
    ROW_NUMBER() OVER (PARTITION BY pf.prod_id ORDER BY pf.date DESC) AS price_rank
FROM
    price_from_farmers pf
JOIN
    product_from_farmers ppf ON ppf.id = pf.prod_id

UNION ALL

SELECT
    ppm2.canprod_id,
    ppm2.category,
    ppm2.brand,
    pm2.prod_id,
    pm2.price / NULLIF(COALESCE(ppm2.qty, 1),0) AS price_per_unit,
    pm2.price AS absolute_price,
    'mecca' AS source,
    ROW_NUMBER() OVER (PARTITION BY pm2.prod_id ORDER BY pm2.date DESC) AS price_rank
FROM
    price_from_mecca pm2
JOIN
    product_from_mecca ppm2 ON ppm2.id = pm2.prod_id

UNION ALL

SELECT
    pps2.canprod_id,
    pps2.category,
    pps2.brand,
    ps2.prod_id,
    ps2.price / NULLIF(COALESCE(pps2.qty, 1),0) AS price_per_unit,
    ps2.price AS absolute_price,
    'sephora' AS source,
    ROW_NUMBER() OVER (PARTITION BY ps2.prod_id ORDER BY ps2.date DESC) AS price_rank
FROM
    price_from_mecca ps2
JOIN
    product_from_mecca pps2 ON pps2.id = ps2.prod_id

UNION ALL

SELECT
    ppz.canprod_id,
    ppz.category,
    ppz.brand,
    pz.prod_id,
    pz.price / NULLIF(COALESCE(ppz.qty, 1),0) AS price_per_unit,
    pz.price AS absolute_price,
    'nz_liquor' AS source,
    ROW_NUMBER() OVER (PARTITION BY pz.prod_id ORDER BY pz.date DESC) AS price_rank
FROM
    price_from_nzliquor pz
JOIN
    product_from_nzliquor ppz ON ppz.id = pz.prod_id

UNION ALL

SELECT
    ppwam.canprod_id,
    ppwam.category,
    ppwam.brand,
    pwam.prod_id,
    pwam.price / NULLIF(COALESCE(ppwam.qty, 1),0) AS price_per_unit,
    pwam.price AS absolute_price,
    'whisky_and_more' AS source,
    ROW_NUMBER() OVER (PARTITION BY pwam.prod_id ORDER BY pwam.date DESC) AS price_rank
FROM
    price_from_whisky_and_more pwam
JOIN
    product_from_whisky_and_more ppwam ON ppwam.id = pwam.prod_id`;

    const obj = {
    auckland:`SELECT
            pa.canprod_id,
            pa.category,
            pa.brand,
            pfa.prod_id,
            pfa.price / NULLIF(COALESCE(pa.qty, 1),0) AS price_per_unit, -- price per unit (adjusted for qty)
            pfa.price AS absolute_price,
            'auckland' AS source,
            ROW_NUMBER() OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date DESC) AS price_rank
        FROM
            price_from_aelia_auckland pfa
        JOIN
            product_from_aelia_auckland pa ON pa.id = pfa.prod_id`,
    queenstown:`SELECT
        pq.canprod_id,
        pq.category,
        pq.brand,
        pfq.prod_id,
        pfq.price / NULLIF(COALESCE(pq.qty, 1),0) AS price_per_unit,
        pfq.price AS absolute_price,
        'queenstown' AS source,
        ROW_NUMBER() OVER (PARTITION BY pfq.prod_id ORDER BY pfq.date DESC) AS price_rank
    FROM
        price_from_aelia_queensland pfq
    JOIN
        product_from_aelia_queensland pq ON pq.id = pfq.prod_id`,
    christchurch:`SELECT
        pc.canprod_id,
        pc.category,
        pc.brand,
        pfc.prod_id,
        pfc.price / NULLIF(COALESCE(pc.qty, 1),0) AS price_per_unit,
        pfc.price AS absolute_price,
        'christchurch' AS source,
        ROW_NUMBER() OVER (PARTITION BY pfc.prod_id ORDER BY pfc.date DESC) AS price_rank
    FROM
        price_from_aelia_christchurch pfc
    JOIN
        product_from_aelia_christchurch pc ON pc.id = pfc.prod_id`,
    sydney:`SELECT
        ps.canprod_id,
        ps.category,
        ps.brand,
        phs.prod_id,
        phs.price / NULLIF(COALESCE(ps.qty, 1),0) AS price_per_unit,
        phs.price AS absolute_price,
        'sydney' AS source,
        ROW_NUMBER() OVER (PARTITION BY phs.prod_id ORDER BY phs.date DESC) AS price_rank
    FROM
        price_from_heinemann_sydney phs
    JOIN
        product_from_heinemann_sydney ps ON ps.id = phs.prod_id`,
    melbourne:`SELECT
        pm.canprod_id,
        pm.category,
        pm.brand,
        plm.prod_id,
        plm.price / NULLIF(COALESCE(pm.qty, 1),0) AS price_per_unit,
        plm.price AS absolute_price,
        'melbourne' AS source,
        ROW_NUMBER() OVER (PARTITION BY plm.prod_id ORDER BY plm.date DESC) AS price_rank
    FROM
        price_from_lotte_melbourne plm
    JOIN
        product_from_lotte_melbourne pm ON pm.id = plm.prod_id`,
    brisbane:`SELECT
        pb.canprod_id,
        pb.category,
        pb.brand,
        plb.prod_id,
        plb.price / NULLIF(COALESCE(pb.qty, 1),0) AS price_per_unit,
        plb.price AS absolute_price,
        'brisbane' AS source,
        ROW_NUMBER() OVER (PARTITION BY plb.prod_id ORDER BY plb.date DESC) AS price_rank
    FROM
        price_from_lotte_brisbane plb
    JOIN
        product_from_lotte_brisbane pb ON pb.id = plb.prod_id`
    }

    if(!filter||filter=="all"){
        query=`${duty_free} UNION ALL ${domestic}`;
    }
    else if(filter=="duty-free"){
        query=duty_free;
    }
    else{
        query=`${obj[sourceQuery]} UNION ALL ${domestic}`;
    }

    const brand = await pool.query(`WITH ranked_prices AS (
        -- Rank the prices per product by source and date to get the latest price
        ${query}       
    ),
    latest_prices AS (
        -- Filter to only keep the latest price entry per product for each source
        SELECT
            rp.canprod_id,
            rp.category,
            rp.brand,
            rp.price_per_unit,
            rp.absolute_price,
            rp.source
        FROM
            ranked_prices rp
        WHERE
            rp.price_rank = 1
    ),
    price_ranges AS (
        -- Determine the minimum and maximum price per unit for each canonical product across all sources
        SELECT
            canprod_id,
            MIN(price_per_unit) AS min_price_per_unit,
            MAX(price_per_unit) AS max_price_per_unit
        FROM
            latest_prices
        GROUP BY
            canprod_id
    ),
    classified_prices AS (
        -- Classify products as cheapest, midrange, or expensive based on their price per unit
        SELECT
            lp.canprod_id,
            lp.category,
            lp.brand,
            lp.price_per_unit,
            lp.source,
            pr.min_price_per_unit,
            pr.max_price_per_unit,
            CASE
                WHEN lp.price_per_unit = pr.min_price_per_unit THEN 'cheapest'
                WHEN lp.price_per_unit = pr.max_price_per_unit THEN 'expensive'
                ELSE 'midrange'
            END AS price_class
        FROM
            latest_prices lp
        JOIN
            price_ranges pr ON lp.canprod_id = pr.canprod_id
    )
    SELECT
    cp.category,
    COUNT(DISTINCT CASE WHEN price_class = 'cheapest' THEN cp.canprod_id END) AS cheapest_count,
    COUNT(DISTINCT CASE WHEN price_class = 'expensive' THEN cp.canprod_id END) AS expensive_count,
    COUNT(DISTINCT CASE WHEN price_class = 'midrange' THEN cp.canprod_id END) AS midrange_count
    FROM
        classified_prices cp
    WHERE
        cp.source = $1
    GROUP BY
        cp.category
    ORDER BY
    cp.category;
    `,[sourceQuery]);

    return res.status(200).json({
        status:"success",
        message:"Brand stats calculated succesfully",
        data:{
            brandData:brand.rows
        }
    })
})
//pending
exports.getAllProductsFor = catchAsync(async (req,res,next)=>{
    const source = req?.query?.source;
    const limit = req?.query?.limit || 5;
    const offset = req?.query?.offset || 0;
    const category = req?.query?.category?.split(",") || [];
    const brand = req?.query?.brand?.split(",") || [];

    if(!source){
        return next(
            new AppError("Source param required",400)
        )
    }

    const data = await pool.query(`WITH RelevantCanonicalProducts AS (
        SELECT DISTINCT cp.id, cp.title
        FROM cannonical_product cp
        JOIN (
            SELECT canprod_id 
            FROM product_from_aelia_auckland 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_aelia_queensland 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_aelia_christchurch 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_lotte_melbourne 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_heinemann_sydney 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_beauty_bliss 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_big_barrel 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_chemist_warehouse 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_farmers 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_lotte_brisbane 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_mecca 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_nzliquor 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_sephora 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
            UNION ALL
            SELECT canprod_id 
            FROM product_from_whisky_and_more 
            WHERE 
                ($3 = '{}'::text[] OR category = ANY($3))
                AND ($4 = '{}'::text[] OR brand = ANY($4))
        ) AS filtered_products
        ON cp.id = filtered_products.canprod_id
        ORDER BY cp.id
        LIMIT $1 OFFSET $2
    )
    SELECT 
        cp.id AS canonical_id,
        cp.title AS canonical_name,
        jsonb_build_object(
            'auckland', (
                SELECT jsonb_agg(pfaa)
                FROM product_from_aelia_auckland pfaa
                WHERE pfaa.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pfaa.category = ANY($3))
                AND ($4 = '{}'::text[] OR pfaa.brand = ANY($4))
            ),
            'queenstown', (
                SELECT jsonb_agg(pfq)
                FROM product_from_aelia_queensland pfq
                WHERE pfq.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pfq.category = ANY($3))
                AND ($4 = '{}'::text[] OR pfq.brand = ANY($4))
            ),
            'christchurch', (
                SELECT jsonb_agg(pfc)
                FROM product_from_aelia_christchurch pfc
                WHERE pfc.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pfc.category = ANY($3))
                AND ($4 = '{}'::text[] OR pfc.brand = ANY($4))
            ),
            'melbourne', (
                SELECT jsonb_agg(plm)
                FROM product_from_lotte_melbourne plm
                WHERE plm.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR plm.category = ANY($3))
                AND ($4 = '{}'::text[] OR plm.brand = ANY($4))
            ),
            'sydney', (
                SELECT jsonb_agg(phs)
                FROM product_from_heinemann_sydney phs
                WHERE phs.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR phs.category = ANY($3))
                AND ($4 = '{}'::text[] OR phs.brand = ANY($4))
            ),
            'beauty_bliss', (
                SELECT jsonb_agg(pbb)
                FROM product_from_beauty_bliss pbb
                WHERE pbb.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pbb.category = ANY($3))
                AND ($4 = '{}'::text[] OR pbb.brand = ANY($4))
            ),
            'big_barrel', (
                SELECT jsonb_agg(pbib)
                FROM product_from_big_barrel pbib
                WHERE pbib.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pbib.category = ANY($3))
                AND ($4 = '{}'::text[] OR pbib.brand = ANY($4))
            ),
            'chemist_warehouse', (
                SELECT jsonb_agg(pcw)
                FROM product_from_chemist_warehouse pcw
                WHERE pcw.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pcw.category = ANY($3))
                AND ($4 = '{}'::text[] OR pcw.brand = ANY($4))
            ),
            'farmers', (
                SELECT jsonb_agg(pfw)
                FROM product_from_farmers pfw
                WHERE pfw.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pfw.category = ANY($3))
                AND ($4 = '{}'::text[] OR pfw.brand = ANY($4))
            ),
            'lotte_brisbane', (
                SELECT jsonb_agg(plb)
                FROM product_from_lotte_brisbane plb
                WHERE plb.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR plb.category = ANY($3))
                AND ($4 = '{}'::text[] OR plb.brand = ANY($4))
            ),
            'mecca', (
                SELECT jsonb_agg(pme)
                FROM product_from_mecca pme
                WHERE pme.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pme.category = ANY($3))
                AND ($4 = '{}'::text[] OR pme.brand = ANY($4))
            ),
            'nzliquor', (
                SELECT jsonb_agg(pnz)
                FROM product_from_nzliquor pnz
                WHERE pnz.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pnz.category = ANY($3))
                AND ($4 = '{}'::text[] OR pnz.brand = ANY($4))
            ),
            'sephora', (
                SELECT jsonb_agg(psf)
                FROM product_from_sephora psf
                WHERE psf.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR psf.category = ANY($3))
                AND ($4 = '{}'::text[] OR psf.brand = ANY($4))
            ),
            'whisky_and_more', (
                SELECT jsonb_agg(pwam)
                FROM product_from_whisky_and_more pwam
                WHERE pwam.canprod_id = cp.id
                AND ($3 = '{}'::text[] OR pwam.category = ANY($3))
                AND ($4 = '{}'::text[] OR pwam.brand = ANY($4))
            )
        ) AS products
    FROM cannonical_product cp
    JOIN RelevantCanonicalProducts rcp ON rcp.id = cp.id
    ORDER BY cp.id
    LIMIT $1 OFFSET $2;
    `,[limit,offset,category,brand]);

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

    const pricerank = await pool.query(`WITH latest_prices_auckland AS (
        -- Get the latest prices for each product by source for Auckland
        SELECT DISTINCT ON (prod_id)
            pa.canprod_id,
            'auckland' AS source,
            pfa.price / NULLIF(COALESCE(pa.qty, 1), 0) AS price_per_unit,
            pfa.date AS price_date
        FROM
            price_from_aelia_auckland pfa
        JOIN
            product_from_aelia_auckland pa ON pa.id = pfa.prod_id
        WHERE
            pa.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pfa.date DESC
    ),
    latest_prices_queenstown AS (
        -- Get the latest prices for each product by source for Queenstown
        SELECT DISTINCT ON (prod_id)
            pq.canprod_id,
            'queenstown' AS source,
            pfq.price / NULLIF(COALESCE(pq.qty, 1), 0) AS price_per_unit,
            pfq.date AS price_date
        FROM
            price_from_aelia_queensland pfq
        JOIN
            product_from_aelia_queensland pq ON pq.id = pfq.prod_id
        WHERE
            pq.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pfq.date DESC
    ),
    latest_prices_christchurch AS (
        -- Get the latest prices for each product by source for Christchurch
        SELECT DISTINCT ON (prod_id)
            pc.canprod_id,
            'christchurch' AS source,
            pfc.price / NULLIF(COALESCE(pc.qty, 1), 0) AS price_per_unit,
            pfc.date AS price_date
        FROM
            price_from_aelia_christchurch pfc
        JOIN
            product_from_aelia_christchurch pc ON pc.id = pfc.prod_id
        WHERE
            pc.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pfc.date DESC
    ),
    latest_prices_melbourne AS (
        -- Get the latest prices for each product by source for Queenstown
        SELECT DISTINCT ON (prod_id)
            pplm.canprod_id,
            'melbourne' AS source,
            plm.price / NULLIF(COALESCE(pplm.qty, 1), 0) AS price_per_unit,
            plm.date AS price_date
        FROM
            price_from_lotte_melbourne plm
        JOIN
            product_from_lotte_melbourne pplm ON pplm.id = plm.prod_id
        WHERE
            pplm.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, plm.date DESC
    ),
    latest_prices_sydney AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            pphs.canprod_id,
            'sydney' AS source,
            phs.price / NULLIF(COALESCE(pphs.qty, 1), 0) AS price_per_unit,
            phs.date AS price_date
        FROM
            price_from_heinemann_sydney phs
        JOIN
            product_from_heinemann_sydney pphs ON pphs.id = phs.prod_id
        WHERE
            pphs.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, phs.date DESC
    ),
    latest_prices_beauty_bliss AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppbb.canprod_id,
            'beauty_bliss' AS source,
            pbb.price / NULLIF(COALESCE(ppbb.qty, 1), 0) AS price_per_unit,
            pbb.date AS price_date
        FROM
            price_from_beauty_bliss pbb
        JOIN
            product_from_beauty_bliss ppbb ON ppbb.id = pbb.prod_id
        WHERE
            ppbb.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pbb.date DESC
    ),
    latest_prices_big_barrel AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppbb2.canprod_id,
            'big_barrel' AS source,
            pbb2.price / NULLIF(COALESCE(ppbb2.qty, 1), 0) AS price_per_unit,
            pbb2.date AS price_date
        FROM
            price_from_big_barrel pbb2
        JOIN
            product_from_big_barrel ppbb2 ON ppbb2.id = pbb2.prod_id
        WHERE
            ppbb2.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pbb2.date DESC
    ),
    latest_prices_chemist_warehouse AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppcw.canprod_id,
            'chemist_warehouse' AS source,
            pcw.price / NULLIF(COALESCE(ppcw.qty, 1), 0) AS price_per_unit,
            pcw.date AS price_date
        FROM
            price_from_chemist_warehouse pcw
        JOIN
            product_from_chemist_warehouse ppcw ON ppcw.id = pcw.prod_id
        WHERE
            ppcw.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pcw.date DESC
    ),
    latest_prices_farmers AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppf.canprod_id,
            'farmers' AS source,
            pf.price / NULLIF(COALESCE(ppf.qty, 1), 0) AS price_per_unit,
            pf.date AS price_date
        FROM
            price_from_farmers pf
        JOIN
            product_from_farmers ppf ON ppf.id = pf.prod_id
        WHERE
            ppf.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pf.date DESC
    ),
    latest_prices_brisbane AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            pplb.canprod_id,
            'brisbane' AS source,
            plb.price / NULLIF(COALESCE(pplb.qty, 1), 0) AS price_per_unit,
            plb.date AS price_date
        FROM
            price_from_lotte_brisbane plb
        JOIN
            product_from_lotte_brisbane pplb ON pplb.id = plb.prod_id
        WHERE
            pplb.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, plb.date DESC
    ),
    latest_prices_mecca AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppm.canprod_id,
            'mecca' AS source,
            pm.price / NULLIF(COALESCE(ppm.qty, 1), 0) AS price_per_unit,
            pm.date AS price_date
        FROM
            price_from_mecca pm
        JOIN
            product_from_mecca ppm ON ppm.id = pm.prod_id
        WHERE
            ppm.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pm.date DESC
    ),
    latest_prices_nzliquor AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppnzl.canprod_id,
            'nzliquor' AS source,
            pnzl.price / NULLIF(COALESCE(ppnzl.qty, 1), 0) AS price_per_unit,
            pnzl.date AS price_date
        FROM
            price_from_nzliquor pnzl
        JOIN
            product_from_nzliquor ppnzl ON ppnzl.id = pnzl.prod_id
        WHERE
            ppnzl.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pnzl.date DESC
    ),
    latest_prices_sephora AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            pps.canprod_id,
            'sephora' AS source,
            ps.price / NULLIF(COALESCE(pps.qty, 1), 0) AS price_per_unit,
            ps.date AS price_date
        FROM
            price_from_sephora ps
        JOIN
            product_from_sephora pps ON pps.id = ps.prod_id
        WHERE
            pps.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, ps.date DESC
    ),
    latest_prices_whisky_and_more AS (
        -- Get the latest prices for each product by source for Sydney
        SELECT DISTINCT ON (prod_id)
            ppwam.canprod_id,
            'whisky_and_more' AS source,
            pwam.price / NULLIF(COALESCE(ppwam.qty, 1), 0) AS price_per_unit,
            pwam.date AS price_date
        FROM
            price_from_whisky_and_more pwam
        JOIN
            product_from_whisky_and_more ppwam ON ppwam.id = pwam.prod_id
        WHERE
            ppwam.canprod_id IS NOT NULL  -- Only include mapped products
        ORDER BY
            prod_id, pwam.date DESC
    ),
    all_latest_prices AS (
        -- Combine all the latest prices from different sources into a single dataset
        SELECT * FROM latest_prices_auckland
        UNION ALL
        SELECT * FROM latest_prices_queenstown
        UNION ALL
        SELECT * FROM latest_prices_christchurch
        UNION ALL
        SELECT * FROM latest_prices_melbourne
        UNION ALL
        SELECT * FROM latest_prices_sydney
        UNION ALL
        SELECT * FROM latest_prices_beauty_bliss
        UNION ALL
        SELECT * FROM latest_prices_big_barrel
        UNION ALL
        SELECT * FROM latest_prices_chemist_warehouse
        UNION ALL
        SELECT * FROM latest_prices_farmers
        UNION ALL
        SELECT * FROM latest_prices_brisbane
        UNION ALL
        SELECT * FROM latest_prices_mecca
        UNION ALL
        SELECT * FROM latest_prices_nzliquor
        UNION ALL
        SELECT * FROM latest_prices_sephora
        UNION ALL
        SELECT * FROM latest_prices_whisky_and_more
    ),
    ranked_prices AS (
        -- Rank the prices per product across all sources
        SELECT
            canprod_id,
            source,
            price_per_unit,
            RANK() OVER (PARTITION BY canprod_id ORDER BY price_per_unit ASC) AS price_rank,
            COUNT(*) OVER (PARTITION BY canprod_id) AS total_sources
        FROM
            all_latest_prices
    ),
    auckland_rank AS (
        -- Filter to Auckland's rank for each mapped product
        SELECT
            canprod_id,
            price_rank,
            total_sources
        FROM
            ranked_prices
        WHERE
            source = $1
    )
    -- Aggregate Auckland's rank and calculate its competitive position
    SELECT
        SUM(CASE WHEN price_rank = 1 THEN 1 ELSE 0 END) AS cheapest_count,
        SUM(CASE WHEN price_rank = total_sources THEN 1 ELSE 0 END) AS most_expensive_count,
        COUNT(*) - SUM(CASE WHEN price_rank = 1 OR price_rank = total_sources THEN 1 ELSE 0 END) AS midrange_count,
        ROUND(AVG(price_rank::NUMERIC), 2) AS average_rank, -- Corrected rounding
        COUNT(*) AS total_products, -- Total products evaluated
        CONCAT(ROUND(AVG(price_rank::NUMERIC), 0)::INT, '/', MAX(total_sources)) AS rank_position -- Corrected rank format
    FROM
        auckland_rank;
    `,[sourceQuery]);

    console.log(pricerank?.rows[0]?.rank_position);

    return res.status(200).json({
        status:"success",
        message:"Pricerank return succesfully",
        data:{
            pricerank:pricerank?.rows[0]?.rank_position
        }
    })

})