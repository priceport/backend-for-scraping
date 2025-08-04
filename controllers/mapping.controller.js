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

    let result, matches = {}, similarity = 1.0;

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
    let newData = await filterCandidates({title:req.query.title},matches["0.3"]);
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


const createMapping = catchAsync(async (req, res, next) => {
    // Validate the required fields in the request body
    const isComplete = isBodyComplete(req, ["source_1", "source_2", "id_1", "id_2", "name"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const { source_1, source_2, id_1, id_2, name } = req.body;

    // Validate the provided sources
    if (!source_1 || !source_2) {
        return next(
            new AppError(`Invalid source value!`, 400)
        );
    }

    // Insert into the canonical_product table
    const canonical = await pool.query(
        `INSERT INTO cannonical_product(title) VALUES($1) RETURNING *`,
        [name]
    );

    if (!canonical.rows[0]) {
        return next(
            new AppError(`Something went wrong while creating canonical product!`, 500)
        );
    }

    const canonicalId = canonical.rows[0].id;

    // Update products from source_1 and source_2 to map them to the canonical product
    const change_1 = await pool.query(
        `UPDATE product SET canprod_id = $1 WHERE id = $2 AND website = $3 RETURNING *`,
        [canonicalId, id_1, source_1]
    );

    const change_2 = await pool.query(
        `UPDATE product SET canprod_id = $1 WHERE id = $2 AND website = $3 RETURNING *`,
        [canonicalId, id_2, source_2]
    );

    // Check if updates were successful
    if (!change_1.rows[0] || !change_2.rows[0]) {
        return next(
            new AppError(`Failed to update one or both source products!`, 500)
        );
    }

    precomputeDailyData('heinemann_sydney',false);

    // Respond with the created canonical product and updated mappings
    return res.status(200).json({
        status: "successful",
        data: {
            canonical: canonical.rows[0],
            change_1: change_1.rows[0],
            change_2: change_2.rows[0],
        },
    });
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

    precomputeDailyData('heinemann_sydney',false);

    // Respond with the updated product
    return res.status(200).json({
        status: "successful",
        data: {
            change: {...updatedProduct.rows[0],latest_price:price?.rows[0]?.price}
        }
    });
});


module.exports = {
    getAllUnmappedProductsFromSource,
    getSimilarityByTitleFromSource,
    createMapping,
    addProductToMapping,
    makeProductUnseen
}