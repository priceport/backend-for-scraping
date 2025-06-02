const pool = require("../configs/postgresql.config");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const isBodyComplete = require("../utils/isBodyComplete");
const redisClient = require("../configs/redis.config");


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
         RETURNING id AS watchlist_id, name AS watchlist_name, created_at;`,
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
    const source = req.query.source;

    if (!watchlistId) {
        return next(
            new AppError(`Watchlist ID is missing from request parameters!`, 400)
        );
    }

    if (!source) {
        return next(
            new AppError("Source param required", 400)
        );
    }

    // First get the watchlist products
    const watchlistProducts = await pool.query(`
        SELECT 
            wp.product_id,
            wp.website AS source_website
        FROM 
            watchlist_products wp
        WHERE 
            wp.watchlist_id = $1
    `, [watchlistId]);

    if (!watchlistProducts.rows.length) {
        return res.status(200).json({
            status: "success",
            message: "No products in watchlist",
            data: []
        });
    }

    // Get the cached data from Redis
    const cachedData = await redisClient.get('daily_product_data');
    if (!cachedData) {
        return next(new AppError("Precomputed data not available. Try again later.", 500));
    }

    // Parse cached data
    let products = JSON.parse(cachedData);

    // Filter products based on watchlist product IDs
    const watchlistProductIds = watchlistProducts.rows.map(wp => wp.product_id);

    products = products.filter(product => {
        // Check if any product in products_data matches our watchlist product IDs
        return product.products_data.some(pd => watchlistProductIds.includes(pd.product_id));
    });

    // Add source price, pricerank, and price comparisons to each product
    products = products.map(product => {
        const sourceProduct = product.products_data.find(pd => pd.website === source);
        if (!sourceProduct) return null;

        // Calculate average price of competitors
        let sum = 0;
        let competitorCount = 0;
        product.products_data.forEach(pd => {
            if (pd.website !== source) {
                sum += parseFloat(pd.latest_price);
                competitorCount++;
            }
        });

        const average = competitorCount > 0 ? (sum / competitorCount).toFixed(2) : 0;
        const difference = (parseFloat(sourceProduct.latest_price) - parseFloat(average)).toFixed(2);
        const difference_percentage = ((parseFloat(difference) / parseFloat(sourceProduct.latest_price)) * 100).toFixed(2);

        return {
            ...product,
            source_price: sourceProduct.latest_price,
            source_pricerank: parseInt(sourceProduct.pricerank.split('/')[0]),
            source_name: sourceProduct.title,
            average,
            difference,
            difference_percentage
        };
    }).filter(product => product !== null); // Remove any products where source wasn't found

    // Respond with the fetched products
    return res.status(200).json({
        status: "success",
        message: "Products from watchlist fetched successfully",
        data: products
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
        RETURNING id AS watchlist_id, name AS watchlist_name, user_id, created_at;
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
        RETURNING id AS watchlist_id, name AS watchlist_name, user_id, created_at;
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