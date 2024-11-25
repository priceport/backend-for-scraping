const pool = require("../configs/postgresql.config");
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

exports.addToWatchlist = catchAsync(async (req, res, next) => {
    // Validate the required fields in the request body
    const isComplete = isBodyComplete(req, ["name"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return next(
            new AppError("User ID is missing or invalid!", 400)
        );
    }

    // Insert the new watchlist into the database
    const watchlist = await pool.query(
        `INSERT INTO watchlists (user_id, name) 
         VALUES ($1, $2) 
         RETURNING id, name, created_at;`,
        [userId, name]
    );

    // Ensure the watchlist was created successfully
    if (!watchlist.rows[0]) {
        return next(
            new AppError("Failed to add watchlist!", 500)
        );
    }

    // Respond with success
    return res.status(200).json({
        status: "success",
        message: "Watchlist added successfully",
        data: watchlist.rows[0],
    });
});


exports.addProductToWatchlist = catchAsync(async (req,res,next)=>{
    const isComplete = isBodyComplete(req,["source"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    const product = await pool.query(`INSERT INTO watchlist_products (watchlist_id, product_id, website, added_at) 
    VALUES ($1, $2, $3, NOW()) 
    RETURNING id, watchlist_id, product_id, website, added_at;
    `,[req?.params?.watchlistId, req?.params?.productId, req?.body?.source]);

    return res.status(200).json({
        status:"success",
        message:"Product added to watchlist",
        data:product?.rows[0]
    })
});

exports.getAllProductsFromWatchlist = catchAsync(async (req, res, next) => {
    const { watchlistId } = req.params;

    if (!watchlistId) {
        return next(
            new AppError(`Watchlist ID is missing from request parameters!`, 400)
        );
    }

    const productData = await pool.query(`
    WITH unit_conversion AS (
        SELECT 'kg' AS unit, 1000.0 AS multiplier
        UNION ALL 
        SELECT 'g', 1.0
        UNION ALL 
        SELECT 'gm', 1.0
        UNION ALL 
        SELECT 'l', 1000.0
        UNION ALL 
        SELECT 'ml', 1.0
    ),
    watchlist_items AS (
        SELECT 
            wp.product_id AS watchlist_product_id,
            wp.website AS source_website,
            p.canprod_id AS canprod_id
        FROM 
            watchlist_products wp
        JOIN 
            product p ON wp.product_id = p.id
        WHERE 
            wp.watchlist_id = $1 -- Replace with the watchlist ID
    ),
    latest_prices AS (
        SELECT 
            price.product_id AS price_product_id,
            MAX(price.date) AS latest_date
        FROM 
            price
        GROUP BY 
            price.product_id
    ),
    latest_price_data AS (
        SELECT 
            p.product_id AS product_id,
            p.price AS latest_price,
            p.date AS price_date
        FROM 
            price p
        JOIN 
            latest_prices lp 
            ON p.product_id = lp.price_product_id AND p.date = lp.latest_date
    ),
    latest_promotions AS (
        SELECT 
            prom.product_id,
            prom.text,
            prom.date,
            prom.price
        FROM 
            promotion prom
        INNER JOIN (
            SELECT 
                product_id,
                MAX(date) AS latest_date
            FROM 
                promotion
            GROUP BY 
                product_id
        ) latest_prom ON prom.product_id = latest_prom.product_id AND prom.date = latest_prom.latest_date
    ),
    competing_products AS (
        SELECT 
            wi.canprod_id AS canprod_id,
            wi.source_website AS source_website,
            p.id AS product_id,
            p.title,
            p.brand,
            p.description,
            p.alcohol,
            p.url,
            p.image_url,
            p.qty,
            p.unit,
            p.created_at,
            p.last_checked,
            p.category,
            p.sub_category,
            p.website,
            lpd.latest_price AS latest_price,
            COALESCE(
                lpd.latest_price / NULLIF(p.qty * uc.multiplier, 0), 
                lpd.latest_price -- Fallback to absolute price if qty or unit is missing
            ) AS price_per_base_unit
        FROM 
            watchlist_items wi
        JOIN 
            product p ON wi.canprod_id = p.canprod_id
        LEFT JOIN 
            latest_price_data lpd ON p.id = lpd.product_id
        LEFT JOIN 
            unit_conversion uc ON p.unit = uc.unit
    ),
    ranked_products AS (
        SELECT 
            cp.*,
            RANK() OVER (PARTITION BY cp.canprod_id ORDER BY cp.price_per_base_unit ASC) AS rank,
            COUNT(*) OVER (PARTITION BY cp.canprod_id) AS total_competitors
        FROM 
            competing_products cp
    ),
    source_ranked_products AS (
        SELECT 
            rp.canprod_id,
            rp.source_website,
            rp.rank || '/' || rp.total_competitors AS source_pricerank
        FROM 
            ranked_products rp
        WHERE 
            rp.website = rp.source_website
    )
    SELECT 
        rp.canprod_id AS canprod_id,
        json_agg(
            json_build_object(
                'qty', rp.qty,
                'url', rp.url,
                'unit', rp.unit,
                'brand', rp.brand,
                'title', rp.title,
                'website', rp.website,
                'category', rp.category,
                'image_url', rp.image_url,
                'pricerank', rp.rank || '/' || rp.total_competitors,
                'product_id', rp.product_id,
                'description', rp.description,
                'latest_price', rp.latest_price,
                'sub_category', rp.sub_category,
                'latest_promotions', (
                    SELECT json_agg(json_build_object('text',lp.text,'price',lp.price,'date',lp.date)) 
                    FROM latest_promotions lp
                    WHERE lp.product_id = rp.product_id
                )
            )
        ) AS products_data,
        srp.source_pricerank
    FROM 
        ranked_products rp
    LEFT JOIN 
        source_ranked_products srp
    ON 
        rp.canprod_id = srp.canprod_id AND rp.source_website = srp.source_website
    GROUP BY 
        rp.canprod_id, rp.source_website, srp.source_pricerank;                   
    `,[watchlistId]);

    // Respond with the fetched products
    return res.status(200).json({
        status: "success",
        message: "Products from watchlist fetched successfully",
        data: productData?.rows,
    });
});


exports.deleteProductFromWatchlist = catchAsync(async (req,res,next)=>{

    const product = await pool.query(`DELETE FROM watchlist_products 
    WHERE watchlist_id = $1 AND product_id = $2 AND website = $3 
    RETURNING id, watchlist_id, product_id, website;
    `,[req?.params?.watchlistId,req?.params?.productId,req?.query?.source]);

    return res.status(204).json({
        status:"success",
        message:"product deleted succesfully",
        data:product?.rows[0]
    })
})

exports.renameWatchlist = catchAsync(async (req,res,next)=>{

    const isComplete = isBodyComplete(req,["name"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    const watchlist = await pool.query(`
        UPDATE watchlists
        SET name = $1
        WHERE id = $2 AND user_id = $3
        RETURNING id, name, user_id, created_at;
    `,[req?.body?.name,req?.params?.watchlistId,req?.user?.id]);

    return res.status(200).json({
        status:"success",
        message:"watchlist renamed succesfully",
        data:watchlist.rows[0]
    })
})

exports.deleteWatchlist = catchAsync(async (req,res,next)=>{
    const watchlist = await pool.query(`DELETE FROM watchlists
        WHERE id = $1 AND user_id = $2
        RETURNING id, name, user_id, created_at;
    `,[req?.params?.watchlistId,req?.user?.id]);

    return res.status(204).json({
        status:"success",
        message:"watchlist deleted succesfully"
    })
})

exports.getAllWatchlist = catchAsync(async (req,res,next)=>{
    const watchlists = await pool.query(`
        SELECT 
        id AS watchlist_id,
        name AS watchlist_name,
        created_at
    FROM 
        watchlists
    WHERE 
        user_id = $1
    ORDER BY 
        created_at DESC;
    `,[req?.user?.id]);

    return res.status(200).json({
        status:"success",
        message:"All watchlist fetched",
        data:watchlists?.rows
    })
})