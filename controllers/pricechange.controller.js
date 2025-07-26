const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");

function getParts(array, parts) {
    const result = [];
    const length = array.length;

    if (!parts || parts <= 0 || length === 0) return array; // Handle edge cases

    // Calculate the step size between selected elements
    const step = (length - 1) / (parts - 1);

    for (let i = 0; i < parts; i++) {
        // Calculate index for each part and round to the nearest integer
        const index = Math.round(i * step);
        result.push(array[index]);
    }

    return result;
}

exports.priceChangeGraph = catchAsync(async (req,res,next)=>{

    let start_date = req?.query?.start_date || null;
    let end_date = req?.query?.end_date || null;
    const sources = req?.query?.sources?.split(",") || null;
    const parts = (parseInt(req?.query?.parts)-1) || null;
    let category = req?.query?.category?.split(",") || null;
    let brand = req?.query?.brand?.split(",") || null;
    const limit = req?.query?.limit;
    const offset = req?.query?.offset;

    // Optimized single query approach
    const optimizedQuery = `
    WITH date_bounds AS (
        SELECT 
            GREATEST(
                COALESCE($1::DATE, MIN(date)),
                MIN(date)
            ) AS start_date,
            LEAST(
                COALESCE($2::DATE, MAX(date)),
                MAX(date)
            ) AS end_date
        FROM price
    ),
    price_changes AS (
        SELECT 
            pr.date AS new_price_date,
            pr.price AS new_price,
            pr.product_id,
            pr.website,
            LAG(pr.price) OVER (
                PARTITION BY pr.product_id, pr.website 
                ORDER BY pr.date
            ) AS old_price,
            LAG(pr.date) OVER (
                PARTITION BY pr.product_id, pr.website 
                ORDER BY pr.date
            ) AS old_price_date,
            p.category,
            p.brand,
            p.canprod_id
        FROM price pr
        JOIN product p ON pr.product_id = p.id
        WHERE 
            ($1::DATE IS NULL OR pr.date >= $1::DATE)
            AND ($2::DATE IS NULL OR pr.date <= $2::DATE)
            AND ($3::VARCHAR[] IS NULL OR p.category = ANY($3::VARCHAR[]))
            AND ($4::VARCHAR[] IS NULL OR p.brand = ANY($4::VARCHAR[]))
            AND ($5::VARCHAR[] IS NULL OR p.website = ANY($5::VARCHAR[]))
            AND p.canprod_id IS NOT NULL
    ),
    daily_stats AS (
        SELECT 
            new_price_date::DATE AS snapshot_date,
            COUNT(CASE WHEN new_price > old_price THEN 1 END) AS increased_count,
            COUNT(CASE WHEN new_price < old_price THEN 1 END) AS decreased_count
        FROM price_changes
        WHERE old_price IS NOT NULL
        GROUP BY new_price_date::DATE
        ORDER BY new_price_date::DATE
    )
    SELECT 
        snapshot_date,
        increased_count,
        decreased_count
    FROM daily_stats
    ORDER BY snapshot_date DESC
    `;

    const data = await pool.query(optimizedQuery, [start_date, end_date, category, brand, sources]);

    let temp = data.rows.map(row => ({
        snapshot_date: row.snapshot_date,
        increased_count: parseInt(row.increased_count) || 0,
        decreased_count: parseInt(row.decreased_count) || 0
    }));

    // Apply parts filtering if specified
    if (parts !== null && parts > 0) {
        temp = getParts(temp, parts + 1); // +1 because getParts expects total parts, not parts-1
    }

    // Apply pagination
    if (offset !== undefined && limit !== undefined) {
        temp = temp.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    }

    return res.status(200).json({
        status: "success",
        message: "Price changes graph fetched successfully",
        data: temp
    });
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

    // const liveStats = await pool.query(`
    // WITH price_changes AS (
    //     SELECT
    //         p.title,
    //         p.brand,
    //         p.description,
    //         p.alcohol,
    //         p.canprod_id,
    //         p.url,
    //         p.image_url,
    //         p.qty,
    //         p.unit,
    //         p.created_at,
    //         p.last_checked,
    //         p.category,
    //         p.sub_category,
    //         pr1.product_id,
    //         pr1.website,
    //         pr1.date AS new_price_date,
    //         pr1.price AS new_price,
    //         LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date) AS old_price,
    //         ROUND(
    //             CASE 
    //                 WHEN LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date) > 0 THEN
    //                     ((pr1.price - LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date)) 
    //                      / LAG(pr1.price) OVER (PARTITION BY pr1.product_id ORDER BY pr1.date)) * 100
    //                 ELSE NULL
    //             END, 2
    //         ) AS percentage_diff
    //     FROM
    //         price pr1
    //     JOIN
    //         product p ON pr1.product_id = p.id
    // ),
    // latest_source_price AS (
    //     SELECT
    //         cp.id AS source_canprod_id,
    //         MAX(pr.date) AS latest_date,
    //         MAX(pr.price) AS latest_price
    //     FROM
    //         cannonical_product cp
    //     JOIN
    //         product p ON p.canprod_id = cp.id
    //     JOIN
    //         price pr ON pr.product_id = p.id
    //     WHERE
    //         p.website = $6::VARCHAR -- Explicit cast for sourceWebsite parameter
    //     GROUP BY
    //         cp.id
    // ),
    // website_filter AS (
    //     SELECT DISTINCT website
    //     FROM product
    //     WHERE $5::VARCHAR[] IS NULL OR website = ANY($5::VARCHAR[]) -- Explicit cast for website array
    // )
    // SELECT
    //     pc.title,
    //     pc.brand,
    //     pc.description,
    //     pc.alcohol,
    //     pc.canprod_id,
    //     pc.url,
    //     pc.image_url,
    //     pc.qty,
    //     pc.unit,
    //     pc.created_at,
    //     pc.last_checked,
    //     pc.category,
    //     pc.sub_category,
    //     pc.new_price_date,
    //     pc.new_price,
    //     pc.old_price,
    //     pc.percentage_diff,
    //     lsp.latest_price AS latest_source_price,
    //     pc.website
    // FROM
    //     price_changes pc
    // LEFT JOIN
    //     latest_source_price lsp ON pc.canprod_id = lsp.source_canprod_id
    // JOIN
    //     website_filter wf ON pc.website = wf.website -- Apply website filtering
    // WHERE
    //     pc.old_price IS NOT NULL -- Exclude entries without price changes
    //     AND pc.new_price != pc.old_price -- Exclude entries where prices are the same
    //     AND ($1::VARCHAR[] IS NULL OR pc.brand = ANY($1::VARCHAR[])) -- Filter by brands
    //     AND ($2::VARCHAR[] IS NULL OR pc.category = ANY($2::VARCHAR[])) -- Filter by categories
    //     AND ($3::DATE IS NULL OR pc.new_price_date >= $3::DATE) -- Filter by start date
    //     AND ($4::DATE IS NULL OR pc.new_price_date <= $4::DATE) -- Filter by end date
    //     AND (
    //         $7::TEXT IS NULL OR (
    //             $7 = 'equal' AND pc.percentage_diff = $8
    //         ) OR (
    //             $7 = 'greater_than' AND pc.percentage_diff > $8
    //         ) OR (
    //             $7 = 'greater_than_equal_to' AND pc.percentage_diff >= $8
    //         ) OR (
    //             $7 = 'less_than' AND pc.percentage_diff < $8
    //         ) OR (
    //             $7 = 'less_than_equal_to' AND pc.percentage_diff <= $8
    //         )
    //     ) -- Dynamic filter based on action_type and action_value
    // ORDER BY
    //     pc.new_price_date DESC
    // OFFSET $9 LIMIT $10;                 
    // `,[brand,category,start_date,end_date,locations,sourceQuery,action,diff_value,offset,limit])
    
    // Optimized single query approach
    const optimizedQuery = `
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
            p.id as product_id,
            pr.date AS new_price_date,
            pr.price AS new_price,
            pr.website,
            LAG(pr.price) OVER (
                PARTITION BY pr.product_id, pr.website 
                ORDER BY pr.date
            ) AS old_price,
            LAG(pr.date) OVER (
                PARTITION BY pr.product_id, pr.website 
                ORDER BY pr.date
            ) AS old_price_date,
            ROUND(
                CASE 
                    WHEN LAG(pr.price) OVER (PARTITION BY pr.product_id, pr.website ORDER BY pr.date) > 0 THEN
                        ((pr.price - LAG(pr.price) OVER (PARTITION BY pr.product_id, pr.website ORDER BY pr.date)) 
                         / LAG(pr.price) OVER (PARTITION BY pr.product_id, pr.website ORDER BY pr.date)) * 100
                    ELSE NULL
                END, 2
            ) AS percentage_diff
        FROM price pr
        JOIN product p ON pr.product_id = p.id
        WHERE 
            ($1::DATE IS NULL OR pr.date >= $1::DATE)
            AND ($2::DATE IS NULL OR pr.date <= $2::DATE)
            AND ($3::VARCHAR[] IS NULL OR p.category = ANY($3::VARCHAR[]))
            AND ($4::VARCHAR[] IS NULL OR p.brand = ANY($4::VARCHAR[]))
            AND ($5::VARCHAR[] IS NULL OR p.website = ANY($5::VARCHAR[]))
            AND p.canprod_id IS NOT NULL
    ),
    latest_source_prices AS (
        SELECT 
            p.canprod_id,
            MAX(pr.price) AS latest_price
        FROM product p
        JOIN price pr ON pr.product_id = p.id
        WHERE p.website = $6::VARCHAR
        GROUP BY p.canprod_id
    ),
    filtered_changes AS (
        SELECT 
            pc.*,
            lsp.latest_price AS latest_source_price
        FROM price_changes pc
        LEFT JOIN latest_source_prices lsp ON pc.canprod_id = lsp.canprod_id
        WHERE 
            pc.old_price IS NOT NULL
            AND pc.new_price != pc.old_price
            AND (
                $7::TEXT IS NULL OR (
                    $7 = 'equal' AND pc.percentage_diff = $8::NUMERIC
                ) OR (
                    $7 = 'greater_than' AND pc.percentage_diff > $8::NUMERIC
                ) OR (
                    $7 = 'greater_than_equal_to' AND pc.percentage_diff >= $8::NUMERIC
                ) OR (
                    $7 = 'less_than' AND pc.percentage_diff < $8::NUMERIC
                ) OR (
                    $7 = 'less_than_equal_to' AND pc.percentage_diff <= $8::NUMERIC
                )
            )
    )
    SELECT 
        title,
        brand,
        description,
        alcohol,
        canprod_id,
        url,
        image_url,
        qty,
        unit,
        created_at,
        last_checked,
        category,
        sub_category,
        product_id,
        new_price_date,
        new_price,
        old_price,
        old_price_date,
        percentage_diff,
        latest_source_price,
        website
    FROM filtered_changes
    ORDER BY new_price_date DESC
    OFFSET $9::INTEGER LIMIT $10::INTEGER
    `;

    // Query to get total count without pagination
    const countQuery = `
    WITH price_changes AS (
        SELECT 
            p.canprod_id,
            pr.date AS new_price_date,
            pr.price AS new_price,
            pr.website,
            LAG(pr.price) OVER (
                PARTITION BY pr.product_id, pr.website 
                ORDER BY pr.date
            ) AS old_price,
            ROUND(
                CASE 
                    WHEN LAG(pr.price) OVER (PARTITION BY pr.product_id, pr.website ORDER BY pr.date) > 0 THEN
                        ((pr.price - LAG(pr.price) OVER (PARTITION BY pr.product_id, pr.website ORDER BY pr.date)) 
                         / LAG(pr.price) OVER (PARTITION BY pr.product_id, pr.website ORDER BY pr.date)) * 100
                    ELSE NULL
                END, 2
            ) AS percentage_diff
        FROM price pr
        JOIN product p ON pr.product_id = p.id
        WHERE 
            ($1::DATE IS NULL OR pr.date >= $1::DATE)
            AND ($2::DATE IS NULL OR pr.date <= $2::DATE)
            AND ($3::VARCHAR[] IS NULL OR p.category = ANY($3::VARCHAR[]))
            AND ($4::VARCHAR[] IS NULL OR p.brand = ANY($4::VARCHAR[]))
            AND ($5::VARCHAR[] IS NULL OR p.website = ANY($5::VARCHAR[]))
            AND p.canprod_id IS NOT NULL
    )
    SELECT COUNT(*) as total_count
    FROM price_changes
    WHERE 
        old_price IS NOT NULL
        AND new_price != old_price
        AND (
            $6::TEXT IS NULL OR (
                $6 = 'equal' AND percentage_diff = $7::NUMERIC
            ) OR (
                $6 = 'greater_than' AND percentage_diff > $7::NUMERIC
            ) OR (
                $6 = 'greater_than_equal_to' AND percentage_diff >= $7::NUMERIC
            ) OR (
                $6 = 'less_than' AND percentage_diff < $7::NUMERIC
            ) OR (
                $6 = 'less_than_equal_to' AND percentage_diff <= $7::NUMERIC
            )
        )
    `;

    // Get total count
    const totalCount = await pool.query(countQuery, [
        start_date, 
        end_date, 
        category, 
        brand, 
        locations, 
        action, 
        diff_value
    ]);

    // Get paginated data
    const data = await pool.query(optimizedQuery, [
        start_date, 
        end_date, 
        category, 
        brand, 
        locations, 
        sourceQuery, 
        action, 
        diff_value, 
        offset || 0, 
        limit || 1000
    ]);

    const totals = parseInt(totalCount.rows[0]?.total_count) || 0;
    return res.status(200).json({
        status:"success",
        message:"Live price monitoring",
        data:data.rows,
        totals
    })
})