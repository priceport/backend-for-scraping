const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");

exports.priceChangeGraph = catchAsync(async (req,res,next)=>{

    const start_date = req?.query?.start_date || null;
    const end_date = req?.query?.end_date || null;
    const sources = req?.query?.sources?.split(",") || null;
    const parts = (parseInt(req?.query?.parts)-1) || null;
    const limit = req?.query?.limit;
    const offset = req?.query?.offset;

    const graphData = await pool.query(`
    WITH date_bounds AS (
        SELECT 
            COALESCE($1::DATE, MIN(date)) AS start_date, -- Use provided start_date or minimum date
            COALESCE($2::DATE, MAX(date)) AS end_date   -- Use provided end_date or maximum date
        FROM 
            price
    ),
    date_range AS (
        SELECT 
            generate_series(
                (SELECT start_date FROM date_bounds),
                (SELECT end_date FROM date_bounds),
                '1 day'::INTERVAL
            )::DATE AS snapshot_date
    ),
    interval_dates AS (
        SELECT 
            snapshot_date,
            ROW_NUMBER() OVER (ORDER BY snapshot_date) AS row_num,
            (SELECT COUNT(*) FROM date_range) AS total_days
        FROM 
            date_range
    ),
    selected_dates AS (
        SELECT 
            snapshot_date
        FROM 
            interval_dates
        WHERE 
            $4::INTEGER IS NULL -- If parts is not provided, include all dates
            OR row_num = 1 -- Always include the first date
            OR row_num = total_days -- Always include the last date
            OR MOD((row_num - 1), CEIL(total_days::NUMERIC / $4::NUMERIC)) = 0 -- Select spaced dates
    )
    SELECT 
        pc.snapshot_date,
        COUNT(CASE WHEN pc.price_change = 'increased' THEN 1 END) AS increased_count,
        COUNT(CASE WHEN pc.price_change = 'decreased' THEN 1 END) AS decreased_count
    FROM 
        (
            SELECT 
                p1.product_id,
                p1.website,
                p1.date AS snapshot_date,
                CASE 
                    WHEN p1.price > p2.price THEN 'increased'
                    WHEN p1.price < p2.price THEN 'decreased'
                    ELSE 'unchanged'
                END AS price_change
            FROM 
                price p1
            LEFT JOIN 
                price p2 
            ON 
                p1.product_id = p2.product_id 
                AND p1.website = p2.website
                AND p1.date = p2.date + INTERVAL '1 day'
            WHERE 
                (COALESCE($1::DATE, (SELECT MIN(date) FROM price)) IS NULL OR p1.date >= COALESCE($1::DATE, (SELECT MIN(date) FROM price))) -- Start date filter
                AND (COALESCE($2::DATE, (SELECT MAX(date) FROM price)) IS NULL OR p1.date <= COALESCE($2::DATE, (SELECT MAX(date) FROM price))) -- End date filter
                AND ($3::TEXT[] IS NULL OR p1.website = ANY($3)) -- Website filter
        ) AS pc
    WHERE 
        pc.snapshot_date IN (SELECT snapshot_date FROM selected_dates)
    GROUP BY 
        pc.snapshot_date
    ORDER BY 
        pc.snapshot_date
    LIMIT $5::INTEGER OFFSET $6::INTEGER;                      
    `,[start_date,end_date,sources,parts,limit,offset]);

    return res.status(200).json({
        status:"success",
        message:"Price changes graph fetched succesfully",
        data:graphData?.rows
    })
});

exports.getLivePriceChanges = catchAsync(async (req,res,next)=>{

    let limit = req?.query?.limit;
    let offset = req?.query?.offset;
    let category = req?.query?.category?.split(",") || null;
    let brand = req?.query?.brand?.split(",") || null;
    let start_date = req?.query?.start_date ||null;
    let end_date = req?.query?.end_date || null;
    let locations = req?.query?.locations?.split(",") || null;
    let diff_value = req?.query?.diff_value || null;
    let action = req?.query?.action || null;
    let sourceQuery = req?.query?.source;

    console.log(sourceQuery,locations);

    const liveStats = await pool.query(`
    WITH price_changes AS (
        SELECT
            p.title,
            p.brand,
            p.description,
            p.alcohol,
            p.canprod_id,
            p.url,
            p.image_url,
            p.qty,
            p.unit,
            p.created_at,
            p.last_checked,
            p.category,
            p.sub_category,
            pr1.product_id,
            pr1.website,
            pr1.date AS new_price_date,
            pr1.price AS new_price,
            LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date) AS old_price,
            CASE 
                WHEN LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date) > 0 THEN
                    ROUND(
                        ((pr1.price - LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date)) 
                         / LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date)) * 100,
                        2
                    )
                ELSE NULL
            END AS percentage_diff
        FROM
            price pr1
        JOIN
            product p ON pr1.product_id = p.id
    ),
    latest_source_price AS (
        SELECT
            cp.id AS source_canprod_id,
            MAX(pr.date) AS latest_date,
            pr.price AS latest_price
        FROM
            cannonical_product cp
        LEFT JOIN
            product p ON p.canprod_id = cp.id
        LEFT JOIN
            price pr ON pr.product_id = p.id
        WHERE
            p.website = $6 -- Use sourceWebsite parameter
        GROUP BY
            cp.id, pr.price
    ),
    website_filter AS (
        SELECT DISTINCT website
        FROM product
        WHERE $5::VARCHAR[] IS NULL OR website = ANY($5::VARCHAR[]) -- Filter by websites if provided
    )
SELECT
    pc.title,
    pc.brand,
    pc.description,
    pc.alcohol,
    pc.canprod_id,
    pc.url,
    pc.image_url,
    pc.qty,
    pc.unit,
    pc.created_at,
    pc.last_checked,
    pc.category,
    pc.sub_category,
    pc.new_price_date,
    pc.new_price,
    pc.old_price,
    pc.percentage_diff,
    lsp.latest_price AS latest_source_price,
    pc.website
FROM
    price_changes pc
LEFT JOIN
    latest_source_price lsp ON pc.canprod_id = lsp.source_canprod_id
JOIN
    website_filter wf ON pc.website = wf.website -- Apply website filtering
WHERE
    pc.old_price IS NOT NULL -- Exclude entries without price changes
    AND pc.new_price != pc.old_price -- Exclude entries where prices are the same
    AND ($1::VARCHAR[] IS NULL OR pc.brand = ANY($1::VARCHAR[])) -- Filter by brands
    AND ($2::VARCHAR[] IS NULL OR pc.category = ANY($2::VARCHAR[])) -- Filter by categories
    AND ($3::DATE IS NULL OR pc.new_price_date >= $3::DATE) -- Filter by start date
    AND ($4::DATE IS NULL OR pc.new_price_date <= $4::DATE) -- Filter by end date
    AND (
        $7::TEXT IS NULL OR (
            $7 = 'equal' AND pc.percentage_diff = $8
        ) OR (
            $7 = 'greater_than' AND pc.percentage_diff > $8
        ) OR (
            $7 = 'greater_than_equal_to' AND pc.percentage_diff >= $8
        ) OR (
            $7 = 'less_than' AND pc.percentage_diff < $8
        ) OR (
            $7 = 'less_than_equal_to' AND pc.percentage_diff <= $8
        )
    ) -- Dynamic filter based on action_type and action_value
ORDER BY
    pc.new_price_date DESC
    OFFSET $9 LIMIT $10;               
    `,[brand,category,start_date,end_date,locations,sourceQuery,action,diff_value,offset,limit])
    
    return res.status(200).json({
        status:"success",
        message:"Live price monitoring",
        data:liveStats.rows
    })
})