const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const isBodyComplete = require("../utils/isBodyComplete.js");
const pool = require("../configs/postgresql.config");
const { filterCandidates } = require("../helpers/filterCandidates.js");
const precomputeDailyData = require("../helpers/precomputeDailyData.js");

const source = {
    auckland:"PRODUCT_FROM_AELIA_AUCKLAND",
    queenstown:"PRODUCT_FROM_AELIA_QUEENSLAND",
    christchurch:"PRODUCT_FROM_AELIA_CHRISTCHURCH",
    melbourne:"PRODUCT_FROM_LOTTE_MELBOURNE",
    sydney:"PRODUCT_FROM_HEINEMANN_SYDNEY",
    beauty_bliss:"PRODUCT_FROM_BEAUTY_BLISS",
    big_barrel:"PRODUCT_FROM_BIG_BARREL",
    chemist_warehouse:"PRODUCT_FROM_CHEMIST_WAREHOUSE",
    farmers:"PRODUCT_FROM_FARMERS",
    brisbane:"PRODUCT_FROM_LOTTE_BRISBANE",
    mecca:"PRODUCT_FROM_MECCA",
    nz_liquor:"PRODUCT_FROM_NZLIQUOR",
    sephora:"PRODUCT_FROM_SEPHORA",
    whisky_and_more:"PRODUCT_FROM_WHISKY_AND_MORE"
}
const getAllUnmappedProductsFromSource = catchAsync(async (req,res,next)=>{
    if(!req.query.source){
        return next(
            new AppError(`source missing from request query!`,400)
        );
    }
    
    let source_query = req?.query?.source;
    let source_category = req?.query?.category ? req?.query?.category.split(",") : null;

    if(!source_query) return next(
        new AppError("Source value required",400)
    )

    const products = await pool.query(`SELECT *
    FROM product
    WHERE website = $1
      AND ($2::text[] IS NULL OR category = ANY($2))
      AND canprod_id IS NULL
      AND last_checked::date > current_date - 5
    ORDER BY seen ASC;
    `,[source_query,source_category]);

    return res.status(200).json({
        status:"successful",
        data:{
            products:products?.rows
        }
    })
});

const makeProductUnseen = catchAsync(async (req,res,next)=>{
    if (!req.query.title || !req.query.source) {
        return next(
            new AppError(`Something missing from request query!`, 400)
        );
    }

    await pool.query(`UPDATE product
    SET seen = FALSE
    WHERE title = $1
      AND website = $2;
    `,[req.query.title,req.query.source]);

    return res.status(200).json({
        status:"success",
        message:"Product made unseen"
    })
});
const getSimilarityByTitleFromSource = catchAsync(async (req, res, next) => {
    if (!req.query.title || !req.query.source) {
        return next(
            new AppError(`Something missing from request query!`, 400)
        );
    }

    console.log("making product seen");
    await pool.query(`UPDATE product
    SET seen = TRUE
    WHERE title = $1
      AND website = $2;
    `,[req.query.title,req.query.source]);

    const { title, source } = req.query;

    let result, matches = {}, similarity = 0.3;

    console.log("fetching similar products");
    while (similarity > 0.2) {
        // Query all other websites except the source
        result = await pool.query(
            `SELECT 
                source.*,
                destination.*
             FROM 
                product AS source
             JOIN 
                product AS destination
             ON 
                source.title = $1 
                
                AND SIMILARITY(source.title, destination.title) > $2
                AND destination.website != $3
             WHERE 
                source.website = $3
                AND source.id != destination.id`,
            [title, similarity, source]
        );

        if (result?.rows?.length > 0) {
            if (!matches[similarity]) matches[similarity] = [];
            matches[similarity].push(...result.rows);
        }

        similarity = (parseFloat(similarity) - 0.1).toFixed(1);
    }

    console.log("filtering similar products using openai from "+matches["0.3"]?.length+" products");
    let newData = await filterCandidates({title:req.query.title},matches["0.3"]?matches["0.3"]:[]);
    console.log(newData);
    
    return res.status(200).json({
        status: "successful",
        data: {
            matches:{
                "0.9":newData
            },
        },
    });
});


const createMapping= catchAsync(async (req, res, next) => {
    // New format only - 1 to 15 products
    const { products, name } = req.body;
    
    // Validate input
    if (!products || !Array.isArray(products) || products.length < 1) {
        return next(
            new AppError(`At least 1 product required for mapping!`, 400)
        );
    }

    if (products.length > 15) {
        return next(
            new AppError(`Maximum 15 products allowed per mapping!`, 400)
        );
    }

    if (!name) {
        return next(
            new AppError(`Canonical product name is required!`, 400)
        );
    }

    // Validate all products have required fields
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (!product.id || !product.source) {
            return next(
                new AppError(`Product ${i + 1} missing id or source!`, 400)
            );
        }
    }

    const productsToMap = products;
    const canonicalName = name;

    // Start transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into the canonical_product table
        const canonical = await client.query(
            `INSERT INTO cannonical_product(title) VALUES($1) RETURNING *`,
            [canonicalName]
        );

        if (!canonical.rows[0]) {
            throw new Error('Failed to create canonical product');
        }

        const canonicalId = canonical.rows[0].id;
        const updatedProducts = [];

        // Update all products to map them to the canonical product
        for (const product of productsToMap) {
            const updatedProduct = await client.query(
                `UPDATE product SET canprod_id = $1 WHERE id = $2 AND website = $3 RETURNING *`,
                [canonicalId, product.id, product.source]
            );

            if (!updatedProduct.rows[0]) {
                throw new Error(`Failed to update product ${product.id} from ${product.source}`);
            }

            // Get latest price for the product
            const price = await client.query(
                `SELECT * FROM price WHERE product_id = $1 ORDER BY date DESC LIMIT 1`,
                [updatedProduct.rows[0].id]
            );

            updatedProducts.push({
                ...updatedProduct.rows[0],
                latest_price: price?.rows[0]?.price || null
            });
        }

        await client.query('COMMIT');

        // Trigger data recomputation for all affected sources
        const uniqueSources = [...new Set(productsToMap.map(p => p.source))];
        for (const source of uniqueSources) {
            precomputeDailyData(source, false);
        }

        // Create response in the old format with change_1, change_2, etc.
        const responseData = {
            canonical: canonical.rows[0]
        };

        // Add each updated product as change_1, change_2, etc.
        updatedProducts.forEach((product, index) => {
            responseData[`change_${index + 1}`] = product;
        });

        // Respond with the created canonical product and updated mappings
        return res.status(200).json({
            status: "successful",
            data: responseData
        });

    } catch (error) {
        await client.query('ROLLBACK');
        return next(
            new AppError(`Failed to create mapping: ${error.message}`, 500)
        );
    } finally {
        client.release();
    }
});


const addProductToMapping = catchAsync(async (req, res, next) => {
    // Validate the required fields in the request body
    const isComplete = isBodyComplete(req, ["source", "id", "canprod_id"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const { source, id, canprod_id } = req.body;

    // Validate the source website
    if (!source) {
        return next(
            new AppError("Invalid source value!", 400)
        );
    }

    // Update the product to associate it with the canonical product
    const updatedProduct = await pool.query(
        `UPDATE product 
         SET canprod_id = $1 
         WHERE id = $2 AND website = $3 
         RETURNING *`,
        [canprod_id, id, source]
    );

    const price = await pool.query(
        `SELECT * FROM price WHERE product_id = $1 ORDER BY date DESC LIMIT 1;`
    ,[updatedProduct?.rows[0]?.id]);

    // Check if the update was successful
    if (!updatedProduct.rows[0]) {
        return next(
            new AppError("Failed to update product mapping!", 500)
        );
    }

    precomputeDailyData('lotte_melbourne',false);

    // Respond with the updated product
    return res.status(200).json({
        status: "successful",
        data: {
            change: {...updatedProduct.rows[0],latest_price:price?.rows[0]?.price}
        }
    });
});

const addMultipleProductsToMapping = catchAsync(async (req, res, next) => {
    // Validate the required fields in the request body
    const isComplete = isBodyComplete(req, ["canprod_id", "products"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const { canprod_id, products } = req.body;

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
        return next(
            new AppError("Products array is required and cannot be empty!", 400)
        );
    }

    if (products.length > 15) {
        return next(
            new AppError("Maximum 15 products allowed per bulk operation!", 400)
        );
    }

    // Validate all products have required fields
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (!product.id || !product.source) {
            return next(
                new AppError(`Product ${i + 1} missing id or source!`, 400)
            );
        }
    }

    // Start transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updatedProducts = [];
        const uniqueSources = new Set();

        // Update all products to associate them with the canonical product
        for (const product of products) {
            const updatedProduct = await client.query(
                `UPDATE product 
                 SET canprod_id = $1 
                 WHERE id = $2 AND website = $3 
                 RETURNING *`,
                [canprod_id, product.id, product.source]
            );

            if (!updatedProduct.rows[0]) {
                throw new Error(`Failed to update product ${product.id} from ${product.source}`);
            }

            // Get latest price for the product
            const price = await client.query(
                `SELECT * FROM price WHERE product_id = $1 ORDER BY date DESC LIMIT 1`,
                [updatedProduct.rows[0].id]
            );

            updatedProducts.push({
                ...updatedProduct.rows[0],
                latest_price: price?.rows[0]?.price || null
            });

            uniqueSources.add(product.source);
        }

        await client.query('COMMIT');

        // Trigger data recomputation for all affected sources
        for (const source of uniqueSources) {
            precomputeDailyData(source, false);
        }

        // Create response in the old format with change_1, change_2, etc.
        const responseData = {};

        // Add each updated product as change_1, change_2, etc.
        updatedProducts.forEach((product, index) => {
            responseData[`change_${index + 1}`] = product;
        });

        // Respond with all updated products
        return res.status(200).json({
            status: "successful",
            data: responseData
        });

    } catch (error) {
        await client.query('ROLLBACK');
        return next(
            new AppError(`Failed to add multiple products to mapping: ${error.message}`, 500)
        );
    } finally {
        client.release();
    }
});


const getProductsInGroup = catchAsync(async (req, res, next) => {
    if (!req.query.canprod_id || !req.query.source) {
        return next(
            new AppError(`canprod_id and source are required!`, 400)
        );
    }

    const { canprod_id, source } = req.query;
    const days = 30; 

    const products = await pool.query(
        `SELECT * FROM product 
         WHERE canprod_id = $1 
           AND website = $2 
           AND last_checked::date > current_date - ($3 || ' days')::INTERVAL
         ORDER BY last_checked DESC`,
        [canprod_id, source, days]
    );

    const shouldShowGroup = products.rows.length === 0;

    return res.status(200).json({
        status: "successful",
        data: {
            canprod_id: parseInt(canprod_id),
            source: source,
            count: products.rows.length,
            products: products.rows,
            has_matching_products: shouldShowGroup  
        }
    });
});

const getMappedSourcesByCanprodId = catchAsync(async (req, res, next) => {
    const { canprod_id } = req.query;

    if (!canprod_id) {
        return next(new AppError("canprod_id is required", 400));
    }

    const result = await pool.query(
        `SELECT DISTINCT website 
         FROM product 
         WHERE canprod_id = $1
           AND last_checked::date > current_date - INTERVAL '35 days'`,
        [canprod_id]
    );

    const sources = result.rows.map(row => row.website);

    return res.status(200).json({
        status: "successful",
        data: {
            sources: sources
        }
    });
});

module.exports = {
    getAllUnmappedProductsFromSource,
    getSimilarityByTitleFromSource,
    createMapping,
    addProductToMapping,
    addMultipleProductsToMapping,
    makeProductUnseen,
    getProductsInGroup,
    getMappedSourcesByCanprodId
}