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
        const { past_date, latest_date, source } = req.query;
    
        // Validate input parameters
        if (!past_date || !latest_date || !source) {
            return res.status(400).json({ error: 'Missing required query parameters: past_date, latest_date, or source' });
        }

        //     // SQL query
        //     let query = `
        //     SELECT 
        //     distinct brand,category
        //     FROM product
        //     WHERE website = $2
        //     AND (created_at <= $1 AND last_checked >= $1) AND canprod_id is not null
        //     `;
    
        //     // Execute the query
        //     const past_results_brands = await pool.query(query, [past_date, source]);
        //     const latest_results_brands = await pool.query(query, [latest_date, source]);

        //     query = `
        //     SELECT 
        //     title,
        //     category
        //     FROM product
        //     WHERE website = $2
        //     AND (created_at <= $1 AND last_checked >= $1) AND canprod_id is not null
        //     `;

        //     const past_results_titles = await pool.query(query, [past_date, source]);
        //     const latest_results_titles = await pool.query(query, [latest_date, source]);
    

        //     const sourceProductsQuery = `
        //         SELECT p.id AS product_id, p.canprod_id, p.category, p.qty, p.unit, 
        //             COALESCE(
        //                 (SELECT price FROM price 
        //                     WHERE product_id = p.id AND date <= $1
        //                     ORDER BY date DESC LIMIT 1),
        //                 0
        //             ) AS price
        //         FROM product p
        //         WHERE p.website = 'aelia_auckland'
        //         AND p.canprod_id is not null
        //         AND p.created_at <= $1
        //         AND p.last_checked >= $1;
        //     `;
        //     const { rows: sourceProductsPast } = await pool.query(sourceProductsQuery, [past_date]);
        //     const { rows: sourceProductsLatest } = await pool.query(sourceProductsQuery, [latest_date]);

        //     // Step 2: Compare source products with their peers
        //     const comparisonsPast = await Promise.all(
        //         sourceProductsPast.map(async (product) => {
        //             const peerPricesQuery = `
        //                 SELECT 
        //                     p.website, 
        //                     p.id AS peer_product_id, 
        //                     COALESCE(
        //                         (SELECT price FROM price 
        //                         WHERE product_id = p.id AND date <= $1
        //                         ORDER BY date DESC LIMIT 1),
        //                         0
        //                     ) AS peer_price,
        //                     p.qty, 
        //                     p.unit
        //                 FROM product p
        //                 WHERE p.canprod_id = $2 AND p.website != 'aelia_auckland';
        //             `;
        //             const { rows: peers } = await pool.query(peerPricesQuery, [past_date, product.canprod_id]);

        //             // Calculate price_per_unit for source
        //             const sourcePricePerUnit = product.qty && product.unit
        //                 ? product.price / product.qty
        //                 : product.price;

        //             // Rank the source product among peers
        //             const allPrices = peers.map(peer => {
        //                 const peerPricePerUnit = peer.qty && peer.unit
        //                     ? peer.peer_price / peer.qty
        //                     : peer.peer_price;
        //                 return peerPricePerUnit;
        //             });

        //             allPrices.push(sourcePricePerUnit);
        //             allPrices.sort((a, b) => a - b);

        //             const rank = allPrices.indexOf(sourcePricePerUnit) + 1;

        //             return {
        //                 category: product.category,
        //                 rank,
        //                 totalPeers: allPrices.length
        //             };
        //         })
        //     );

        //     const comparisonsLatest = await Promise.all(
        //         sourceProductsLatest.map(async (product) => {
        //             const peerPricesQuery = `
        //                 SELECT 
        //                     p.website, 
        //                     p.id AS peer_product_id, 
        //                     COALESCE(
        //                         (SELECT price FROM price 
        //                         WHERE product_id = p.id AND date <= $1
        //                         ORDER BY date DESC LIMIT 1),
        //                         0
        //                     ) AS peer_price,
        //                     p.qty, 
        //                     p.unit
        //                 FROM product p
        //                 WHERE p.canprod_id = $2 AND p.website != 'aelia_auckland';
        //             `;
        //             const { rows: peers } = await pool.query(peerPricesQuery, [latest_date, product.canprod_id]);

        //             // Calculate price_per_unit for source
        //             const sourcePricePerUnit = product.qty && product.unit
        //                 ? product.price / product.qty
        //                 : product.price;

        //             // Rank the source product among peers
        //             const allPrices = peers.map(peer => {
        //                 const peerPricePerUnit = peer.qty && peer.unit
        //                     ? peer.peer_price / peer.qty
        //                     : peer.peer_price;
        //                 return peerPricePerUnit;
        //             });

        //             allPrices.push(sourcePricePerUnit);
        //             allPrices.sort((a, b) => a - b);

        //             const rank = allPrices.indexOf(sourcePricePerUnit) + 1;

        //             return {
        //                 category: product.category,
        //                 rank,
        //                 totalPeers: allPrices.length
        //             };
        //         })
        //     );

        //     // Step 3: Aggregate rankings by category
        //     const categoryRanksPast = comparisonsPast.reduce((acc, comp) => {
        //         if (!acc[comp.category]) {
        //             acc[comp.category] = { totalRank: 0, count: 0 };
        //         }
        //         acc[comp.category].totalRank += (comp.rank/comp.totalPeers);
        //         acc[comp.category].count += 1;
        //         return acc;
        //     }, {});

        //     const categoryRanksLatest = comparisonsLatest.reduce((acc, comp) => {
        //         if (!acc[comp.category]) {
        //             acc[comp.category] = { totalRank: 0, count: 0 };
        //         }
        //         acc[comp.category].totalRank += (comp.rank/comp.totalPeers);
        //         acc[comp.category].count += 1;
        //         return acc;
        //     }, {});

        //     const categoryRankListPast = Object.entries(categoryRanksPast)
        //         .map(([category, data]) => ({
        //             category,
        //             avgRank: data.totalRank / data.count
        //         }))
        //         .sort((a, b) => a.avgRank - b.avgRank);

        //     const categoryRankListLatest = Object.entries(categoryRanksLatest)
        //         .map(([category, data]) => ({
        //             category,
        //             avgRank: data.totalRank / data.count
        //         }))
        //         .sort((a, b) => a.avgRank - b.avgRank);

        //     // Assign ranks to categories based on their average rank
        //     categoryRankListPast.forEach((item, index) => {
        //         item.priceRank = index + 1; // Cheapest is rank 1
        //     });

        //     categoryRankListLatest.forEach((item, index) => {
        //         item.priceRank = index + 1; // Cheapest is rank 1
        //     });


            //new logic
            let past_data = await pool.query(`SELECT 
            *
            FROM product
            WHERE website = $2
            AND (created_at::date <= $1 AND last_checked::date >= $1) AND canprod_id is not null`,[past_date,source]);

            let latest_data = await pool.query(`SELECT 
            *
            FROM product
            WHERE website = $2
            AND (created_at::date <= $1 AND last_checked::date >= $1) AND canprod_id is not null`,[latest_date,source]);

            past_data = past_data.rows;
            latest_data = latest_data.rows;

            let past_brand = {}, past_category = {}, latest_brand = {}, latest_category={};

            for(let i =0;i<past_data?.length;i++){
                past_brand[past_data[i]?.brand] = {brand:past_data[i]?.brand,category:past_data[i]?.category};
                past_category[past_data[i]?.category] = true;
            }

            for(let i =0;i<latest_data?.length;i++){
                latest_brand[latest_data[i]?.brand] = {brand:latest_data[i]?.brand,category:latest_data[i]?.category};
                latest_category[latest_data[i]?.category] = true;
            }

            past_brand = Object.keys(past_brand)?.map(key=>past_brand[key]);
            past_category = Object.keys(past_category)?.map(key=>key);
            latest_brand = Object.keys(latest_brand)?.map(key=>latest_brand[key]);
            latest_category = Object.keys(latest_category)?.map(key=>key);
            
            // rabanne invictus parfum 100ml
            // Send the response
            res.status(200).json({
                status:"success",
                message:"time trends fetched succesfully",
                data:{
                    brands:{
                        past:{
                        count:past_brand?.length,
                        data:past_brand
                        },
                        latest:{
                        count:latest_brand?.length,
                        data:latest_brand
                        }
                    },
                    products:{
                        past:{
                        count:past_data?.length,
                        data:past_data
                        },
                        latest:{
                        count:latest_data?.length,
                        data:latest_data
                        }
                    }
                }
            });  
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