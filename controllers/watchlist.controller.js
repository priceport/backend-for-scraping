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
    const sort = req.query.sort || 'A_to_Z'; // Default to A_to_Z if not provided

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

    // Validate sort parameter
    const validSortOptions = ['A_to_Z', 'Z_to_A', 'price_low_to_high', 'price_high_to_low', 'pricerank_low_to_high', 'pricerank_high_to_low', 'difference_low_to_high', 'difference_high_to_low', 'difference_percentage_low_to_high', 'difference_percentage_high_to_low'];
    if (!validSortOptions.includes(sort)) {
        return next(
            new AppError("Invalid sort parameter. Valid options: A_to_Z, Z_to_A, price_low_to_high, price_high_to_low, pricerank_low_to_high, pricerank_high_to_low, difference_low_to_high, difference_high_to_low, difference_percentage_low_to_high, difference_percentage_high_to_low", 400)
        );
    }

    // Helper function to calculate price per unit (same as in product.controller.js)
    const calculatePricePerUnit = (qty, unit, price) => {
        if (!qty || !unit || !price) return null;
        const unitMapping = {
            ml: 1,
            l: 1000,
            g: 1,
            kg: 1000,
        };
        const standardizedQty = qty * (unitMapping[unit.toLowerCase()] || 1);
        return price / standardizedQty;
    };

    // Helper function to calculate ranks with ties (same as in product.controller.js)
    const calculateRanksWithTies = (items, valueKey) => {
        const sortedItems = [...items].sort((a, b) => a[valueKey] - b[valueKey]);
        let rank = 1;
        for (let i = 0; i < sortedItems.length; i++) {
            if (i > 0 && sortedItems[i][valueKey] === sortedItems[i - 1][valueKey]) {
                sortedItems[i].rank = sortedItems[i - 1].rank;
            } else {
                sortedItems[i].rank = rank;
            }
            rank++;
        }
        return sortedItems;
    };

    // First get the watchlist products with their canprod_id
    const watchlistProducts = await pool.query(`
        SELECT 
            wp.product_id,
            wp.website AS source_website,
            p.canprod_id
        FROM 
            watchlist_products wp
        JOIN 
            product p ON wp.product_id = p.id
        WHERE 
            wp.watchlist_id = $1
            AND p.canprod_id IS NOT NULL
    `, [watchlistId]);

    if (!watchlistProducts.rows.length) {
        return res.status(200).json({
            status: "success",
            message: "No products in watchlist",
            data: []
        });
    }

    // Get the cached data from Redis
    const cachedData = await redisClient.get('daily_product_data'+source);
    if (!cachedData) {
        return next(new AppError("Precomputed data not available. Try again later.", 500));
    }

    // Parse cached data
    let products = JSON.parse(cachedData);

    // Filter products based on canprod_id from watchlist products
    const watchlistCanprodIds = watchlistProducts.rows.map(wp => wp.canprod_id);

    products = products.filter(product => {
        // Check if the product's canprod_id matches any of our watchlist canprod_ids
        return watchlistCanprodIds.includes(product.canprod_id);
    });

    // Process each product with price ranking logic (same as getAllProductsFor)
    products = products.map(product => {
        let filteredProductsData = product.products_data;
        const sourceIndex = filteredProductsData?.findIndex(el => el.website == source);
        if (sourceIndex === -1) return null;

        // Calculate price per unit or fallback to flat price
        let hasUnitAndQty = true;
        const rankedProducts = filteredProductsData.map(pd => { 
            if (!pd.unit || !pd.qty) hasUnitAndQty = false;
            return ({
                ...pd,
                price_per_unit: calculatePricePerUnit(pd.qty, pd.unit, pd.latest_price) || pd.latest_price,
            });
        });

        // Recalculate ranks with ties
        const rankedWithTies = calculateRanksWithTies(rankedProducts, hasUnitAndQty ? 'price_per_unit' : 'latest_price');
        let sum = 0;
        rankedWithTies.forEach(pd => {
            pd.pricerank = `${pd.rank}/${rankedWithTies.length}`;
            if (pd.website != source) sum += parseFloat(pd.latest_price);
        });

        // Find the updated source pricerank and price
        const sourceProduct = rankedWithTies.find(pd => pd.website === source);
        if (!sourceProduct) return null;

        const sourcePriceRank = sourceProduct ? parseInt(sourceProduct.pricerank.split('/')[0], 10) : null;
        const sourcePrice = sourceProduct ? sourceProduct.latest_price : null;
        const sourceName = sourceProduct ? sourceProduct.title : null;
        const average = rankedWithTies?.length != 1 ? (sum / (rankedWithTies?.length - 1)).toFixed(2) : 0;
        const difference = sourceProduct ? (parseFloat(sourceProduct.latest_price) - average).toFixed(2) : 0;
        const difference_percentage = sourceProduct ? ((difference / parseFloat(sourceProduct.latest_price)) * 100).toFixed(2) : 0;

        // Determine price range based on source pricerank
        let price_range = null;
        if (sourcePriceRank === 1) {
            price_range = "cheapest";
        } else if (sourcePriceRank === rankedWithTies.length) {
            price_range = "expensive";
        } else {
            price_range = "midrange";
        }

        return {
            ...product,
            products_data: rankedWithTies,
            source_pricerank: sourcePriceRank,
            source_price: sourcePrice,
            source_name: sourceName,
            average,
            difference,
            difference_percentage,
            price_range
        };
    }).filter(product => product !== null);

    // Sort products based on the sort parameter
    if (sort === 'A_to_Z') {
        products.sort((a, b) => a.source_name.toLowerCase().localeCompare(b.source_name.toLowerCase()));
    } else if (sort === 'Z_to_A') {
        products.sort((a, b) => b.source_name.toLowerCase().localeCompare(a.source_name.toLowerCase()));
    } else if (sort === 'price_low_to_high') {
        products.sort((a, b) => a.source_price - b.source_price);
    } else if (sort === 'price_high_to_low') {
        products.sort((a, b) => b.source_price - a.source_price);
    } else if (sort === 'pricerank_low_to_high') {
        products.sort((a, b) => a.source_pricerank - b.source_pricerank);
    } else if (sort === 'pricerank_high_to_low') {
        products.sort((a, b) => b.source_pricerank - a.source_pricerank);
    } else if (sort === 'difference_low_to_high') {
        products.sort((a, b) => a.difference - b.difference);
    } else if (sort === 'difference_high_to_low') {
        products.sort((a, b) => b.difference - a.difference);
    } else if (sort === 'difference_percentage_low_to_high') {
        products.sort((a, b) => a.difference_percentage - b.difference_percentage);
    } else if (sort === 'difference_percentage_high_to_low') {
        products.sort((a, b) => b.difference_percentage - a.difference_percentage);
    }

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