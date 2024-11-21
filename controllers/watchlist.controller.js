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

exports.addToWatchlist = catchAsync(async (req,res,next)=>{

    const isComplete = isBodyComplete(req,["name"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    const watchlist = await pool.query(`INSERT INTO watchlists (user_id, name) 
    VALUES ($1, $2) 
    RETURNING id, name, created_at;`,
    [req?.user?.id,req?.body?.name]);

    return res.status(200).json({
        status:"success",
        message:"Watchlist added succesfully",
        data:watchlist?.rows[0]
    })
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
    `,[req?.params?.watchlistId, req?.params?.productId, source[req?.body?.source]]);

    return res.status(200).json({
        status:"success",
        message:"Product added to watchlist",
        data:product?.rows[0]
    })
});

exports.getAllProductsFromWatchlist = catchAsync(async (req,res,next)=>{
    const products = await pool.query(`
        SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_aelia_auckland p ON wp.product_id = p.id AND wp.website = 'AELIA_AUCKLAND'
    WHERE 
        wp.watchlist_id = $1

    UNION ALL

    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_aelia_queensland p ON wp.product_id = p.id AND wp.website = 'AELIA_QUEENSLAND'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL

    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_aelia_christchurch p ON wp.product_id = p.id AND wp.website = 'AELIA_CHRISTCHURCH'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 

    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_lotte_melbourne p ON wp.product_id = p.id AND wp.website = 'LOTTE_MELBOURNE'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_heinemann_sydney p ON wp.product_id = p.id AND wp.website = 'HEINEMANN_SYDNEY'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_beauty_bliss p ON wp.product_id = p.id AND wp.website = 'BEAUTY_BLISS'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_big_barrel p ON wp.product_id = p.id AND wp.website = 'BIG_BARREL'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_chemist_warehouse p ON wp.product_id = p.id AND wp.website = 'CHEMIST_WAREHOUSE'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_farmers p ON wp.product_id = p.id AND wp.website = 'FARMERS'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_lotte_brisbane p ON wp.product_id = p.id AND wp.website = 'LOTTE_BRISBANE'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_mecca p ON wp.product_id = p.id AND wp.website = 'MECCA'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_nzliquor p ON wp.product_id = p.id AND wp.website = 'NZLIQUOR'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_sephora p ON wp.product_id = p.id AND wp.website = 'SEPHORA'
    WHERE 
    wp.watchlist_id = $1

    UNION ALL 
    
    SELECT 
        wp.id AS watchlist_product_id,
        wp.watchlist_id,
        wp.website,
        p.id AS product_id,
        p.title,
        p.brand,
        p.description,
        p.alcohol,
        p.qty,
        p.unit,
        p.image_url,
        p.url,
        p.category,
        p.sub_category,
        wp.added_at
    FROM 
        watchlist_products wp
    JOIN 
        product_from_whisky_and_more p ON wp.product_id = p.id AND wp.website = 'WHISKY_AND_MORE'
    WHERE 
    wp.watchlist_id = $1
    `,[req?.params?.watchlistId]);

    return res.status(200).json({
        status:"success",
        message:"product from watchlist fetched succesfully",
        data:products?.rows
    })
});

exports.deleteProductFromWatchlist = catchAsync(async (req,res,next)=>{

    const product = await pool.query(`DELETE FROM watchlist_products 
    WHERE watchlist_id = $1 AND product_id = $2 AND website = $3 
    RETURNING id, watchlist_id, product_id, website;
    `,[req?.params?.watchlistId,req?.params?.productId,source[req?.query?.source]]);

    console.log(product?.rows);

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

    console.log(watchlist.rows);

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