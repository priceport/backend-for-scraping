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

    // const graphData = await pool.query(`
    // WITH date_bounds AS (
    //     SELECT 
    //         COALESCE($1::DATE, MIN(date)) AS start_date, -- Use provided start_date or minimum date
    //         COALESCE($2::DATE, MAX(date)) AS end_date   -- Use provided end_date or maximum date
    //     FROM 
    //         price
    // ),
    // date_range AS (
    //     SELECT 
    //         generate_series(
    //             (SELECT start_date FROM date_bounds),
    //             (SELECT end_date FROM date_bounds),
    //             '1 day'::INTERVAL
    //         )::DATE AS snapshot_date
    // ),
    // interval_dates AS (
    //     SELECT 
    //         snapshot_date,
    //         ROW_NUMBER() OVER (ORDER BY snapshot_date) AS row_num,
    //         (SELECT COUNT(*) FROM date_range) AS total_days
    //     FROM 
    //         date_range
    // ),
    // selected_dates AS (
    //     SELECT 
    //         snapshot_date
    //     FROM 
    //         interval_dates
    //     WHERE 
    //         $4::INTEGER IS NULL -- If parts is not provided, include all dates
    //         OR row_num = 1 -- Always include the first date
    //         OR row_num = total_days -- Always include the last date
    //         OR MOD((row_num - 1), CEIL(total_days::NUMERIC / $4::NUMERIC)) = 0 -- Select spaced dates
    // )
    // SELECT 
    //     pc.snapshot_date,
    //     COUNT(CASE WHEN pc.price_change = 'increased' THEN 1 END) AS increased_count,
    //     COUNT(CASE WHEN pc.price_change = 'decreased' THEN 1 END) AS decreased_count
    // FROM 
    //     (
    //         SELECT 
    //             p1.product_id,
    //             p1.website,
    //             p1.date AS snapshot_date,
    //             CASE 
    //                 WHEN p1.price > p2.price THEN 'increased'
    //                 WHEN p1.price < p2.price THEN 'decreased'
    //                 ELSE 'unchanged'
    //             END AS price_change
    //         FROM 
    //             price p1
    //         LEFT JOIN 
    //             price p2 
    //         ON 
    //             p1.product_id = p2.product_id 
    //             AND p1.website = p2.website
    //             AND p1.date = p2.date + INTERVAL '1 day'
    //         WHERE 
    //             (COALESCE($1::DATE, (SELECT MIN(date) FROM price)) IS NULL OR p1.date >= COALESCE($1::DATE, (SELECT MIN(date) FROM price))) -- Start date filter
    //             AND (COALESCE($2::DATE, (SELECT MAX(date) FROM price)) IS NULL OR p1.date <= COALESCE($2::DATE, (SELECT MAX(date) FROM price))) -- End date filter
    //             AND ($3::TEXT[] IS NULL OR p1.website = ANY($3)) -- Website filter
    //     ) AS pc
    // WHERE 
    //     pc.snapshot_date IN (SELECT snapshot_date FROM selected_dates)
    // GROUP BY 
    //     pc.snapshot_date
    // ORDER BY 
    //     pc.snapshot_date
    // LIMIT $5::INTEGER OFFSET $6::INTEGER;                      
    // `,[start_date,end_date,sources,parts,limit,offset]);


    //new query
    const dates = await pool.query(`SELECT 
    GREATEST(
        COALESCE($1::DATE, MIN(date)),  -- Use min_date if start_date is NULL
        MIN(date)                       -- Ensure it's not less than min_date
    ) AS start_date, -- Use provided start_date or minimum date
    LEAST(
        COALESCE($2::DATE, MAX(date)),  -- Use min_date if start_date is NULL
        MAX(date)                       -- Ensure it's not less than min_date
    ) AS end_date   -- Use provided end_date or maximum date
    FROM 
    price`,[start_date,end_date]);


    const data = await pool.query(`select pr.date as new_price_date, pr.price as new_price, p.* from price pr JOIN product p ON pr.product_id = p.id WHERE 
    ($1::DATE IS NULL OR pr.date >= $1::DATE) 
    AND ($2::DATE IS NULL OR pr.date <= $2::DATE)
    AND ($3::VARCHAR[] IS NULL OR p.category = ANY($3::VARCHAR[]))
    AND ($4::VARCHAR[] IS NULL OR p.brand = ANY($4::VARCHAR[]))
    AND ($5::VARCHAR[] IS NULL OR p.website = ANY($5::VARCHAR[]))
    AND p.canprod_id IS NOT NULL
    ORDER BY pr.date DESC;`,[dates.rows[0].start_date,dates.rows[0].end_date,category,brand,sources]);

    let temp = {};
    
    for(let i=0;i<data?.rows?.length;i++){

        const last_price_website = await pool.query(`SELECT price,date
        FROM price
        WHERE product_id = $3
          AND date::DATE < $1
          AND website = $2
        ORDER BY date DESC
        LIMIT 1;`,[data?.rows[i]?.new_price_date,data?.rows[i]?.website,data?.rows[i]?.id]);

        if(!last_price_website?.rows ||last_price_website?.rows?.length == 0) {
            data.rows[i].old_price = 0;
            data.rows[i].percentage_diff = 100
        }
        else {
            data.rows[i].old_price_date = last_price_website.rows[0].date;
            data.rows[i].old_price = last_price_website.rows[0]?.price;
            data.rows[i].percentage_diff = ((data.rows[i].new_price - data.rows[i].old_price)/ data.rows[i].old_price) * 100;
        }

        if(!temp[data.rows[i]?.new_price_date?.toISOString()?.split("T")[0]]){
            temp[data.rows[i]?.new_price_date?.toISOString()?.split("T")[0]] = {
                snapshot_date:data.rows[i]?.new_price_date,
                increased_count:0,
                decreased_count:0
            }
        }

        if(data.rows[i].percentage_diff>0) temp[data.rows[i]?.new_price_date?.toISOString()?.split("T")[0]].increased_count +=1;
        else if(data.rows[i].percentage_diff<0) temp[data.rows[i]?.new_price_date?.toISOString()?.split("T")[0]].decreased_count +=1;
    }

    temp = Object.keys(temp)?.map(key=>temp[key]);

    temp = getParts(temp,parts);

    if(offset!==undefined&&limit!==undefined){
        temp = temp.slice(offset, parseInt(offset) + parseInt(limit));
    }

    return res.status(200).json({
        status:"success",
        message:"Price changes graph fetched succesfully",
        data:temp
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
    
    const data = await pool.query(`select pr.date as new_price_date, pr.price as new_price, p.* from price pr JOIN product p ON pr.product_id = p.id WHERE 
    ($1::DATE IS NULL OR pr.date >= $1::DATE) 
    AND ($2::DATE IS NULL OR pr.date <= $2::DATE)
    AND ($3::VARCHAR[] IS NULL OR p.category = ANY($3::VARCHAR[]))
    AND ($4::VARCHAR[] IS NULL OR p.brand = ANY($4::VARCHAR[]))
    AND ($5::VARCHAR[] IS NULL OR p.website = ANY($5::VARCHAR[]))
    AND p.canprod_id IS NOT NULL
    ORDER BY pr.date DESC;`,[start_date,end_date,category,brand,locations]);
    
    for(let i=0;i<data?.rows?.length;i++){

        const last_price_website = await pool.query(`SELECT price,date
        FROM price
        WHERE product_id = $3
          AND date::DATE < $1
          AND website = $2
        ORDER BY date DESC
        LIMIT 1;`,[data?.rows[i]?.new_price_date,data?.rows[i]?.website,data?.rows[i]?.id]);

        const source_canprod = await pool.query(`SELECT id FROM product WHERE canprod_id=$1 AND website=$2`,[data?.rows[i]?.canprod_id,sourceQuery]);

        let last_source_website;
        if(source_canprod&&source_canprod?.rows?.length>0)
        last_source_website = await pool.query(`SELECT price,date
        FROM price
        WHERE product_id = $1
        ORDER BY date DESC
        LIMIT 1;`,[source_canprod?.rows[0]?.id]);

        if(!last_price_website?.rows ||last_price_website?.rows?.length == 0) {
            data.rows[i].old_price = 0;
            data.rows[i].percentage_diff = 100
        }
        else {
            data.rows[i].old_price_date = last_price_website.rows[0].date;
            data.rows[i].old_price = last_price_website.rows[0]?.price;
            data.rows[i].percentage_diff = ((data.rows[i].new_price - data.rows[i].old_price)/ data.rows[i].old_price) * 100;
        }

        if(!last_source_website || last_source_website.rows.length==0) data.rows[i].latest_source_price = null;
        else data.rows[i].latest_source_price = last_source_website.rows[0].price;
    }

    if(action&&(diff_value!==null))
    data.rows = data.rows.filter(el=>{
        if(action=='equal'){
            return parseFloat(el.percentage_diff.toFixed(3)) == parseFloat(parseFloat(diff_value).toFixed(3));
        }
        else if(action=='greater_than'){
            return parseFloat(el.percentage_diff.toFixed(3)) > parseFloat(parseFloat(diff_value).toFixed(3));
        }
        else if(action=='greater_than_equal_to'){
            return parseFloat(el.percentage_diff.toFixed(3)) >= parseFloat(parseFloat(diff_value).toFixed(3));
        }
        else if(action=='less_than'){
            return parseFloat(el.percentage_diff.toFixed(3)) < parseFloat(parseFloat(diff_value).toFixed(3));
        }
        else if(action=='less_than_equal_to'){
            return parseFloat(el.percentage_diff.toFixed(3)) <= parseFloat(parseFloat(diff_value).toFixed(3));
        }
    })

    const totals = data?.rows?.length;

    if(offset!==undefined&&limit!==undefined){
    data.rows = data.rows.slice(offset, parseInt(offset) + parseInt(limit));
    }
    return res.status(200).json({
        status:"success",
        message:"Live price monitoring",
        data:data.rows,
        totals
    })
})