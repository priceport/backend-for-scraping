const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const isBodyComplete = require("../utils/isBodyComplete.js");
const pool = require("../configs/postgresql.config");

const source = {
    auckland:"PRODUCT_FROM_AELIA_AUCKLAND",
    queenstown:"PRODUCT_FROM_AELIA_QUEENSLAND",
    chirstchurch:"PRODUCT_FROM_AELIA_CHRISTCHURCH",
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

    let source_table = source[req?.query?.source];

    if(!source_table) return next(
        new AppError("Invalid source value",400)
    )

    const products = await pool.query(`SELECT * FROM ${source_table} WHERE canprod_id IS NULL`);

    return res.status(200).json({
        status:"successful",
        data:{
            products:products?.rows
        }
    })
});

const getSimilarityByTitleFromSource = catchAsync(async (req,res,next)=>{
    if(!req.query.title||!req.query.source){
        return next(
            new AppError(`Something missing from request query!`,400)
        );
    }

    let source_table = source[req?.query?.source];

    if(!source_table) return next(
        new AppError("Invalid source value",400)
    )

    let result,match={},similarity = 1.0,location;

    while(similarity>0){
        for(let key of Object.keys(source)){
            if(key == req?.query?.source) continue;

            result = await pool.query(`SELECT * FROM ${source_table} AS source JOIN ${source[key]} AS destination ON source.title = $1 AND source.brand = destination.brand AND SIMILARITY(source.title, destination.title) > ${similarity}`,[req?.query?.title]);
            
            if(result?.rows?.length > 0) {
                if(!match[similarity]) match[similarity] = [];

                match[similarity].push(result?.rows);
                // location = key;
            }
            
            // if(match?.rows[0]?.canprod_id !=null) break;
        }

        // if(match?.rows?.length > 0) break;

        similarity = (parseFloat(similarity) - 0.1).toFixed(1);
    }

    return res.status(200).json({
        status:"successful",
        data:{
            match
        }
    })
});

const createMapping = catchAsync(async (req,res,next)=>{
    const isComplete = isBodyComplete(req,["source_1","source_2","id_1","id_2","name"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    const table_1 = source[req?.body?.source_1];
    const table_2 = source[req?.body?.source_2];

    if(!table_1||!table_2) return next(
        new AppError(`Invalid source value!`,400)
    )

    const cannonical = await pool.query(`INSERT INTO cannonical_product(title) VALUES($1) returning *`,[req?.body?.name]);

    if(!cannonical.rows[0]) return next(
        new AppError(`Something went wrong!`,500)
    )

    let change_1 = await pool.query(`UPDATE ${table_1} SET canprod_id = $1 WHERE id=$2 returning *`,[cannonical?.rows[0]?.id,req?.body?.id_1]);
    let change_2 = await pool.query(`UPDATE ${table_2} SET canprod_id = $1 WHERE id=$2 returning *`,[cannonical?.rows[0]?.id,req?.body?.id_2]);

    return res?.status(200)?.json({
        status:"successful",
        data:{
            cannonical:cannonical?.rows,
            change_1:change_1?.rows,
            change_2:change_2?.rows
        }
    })
})


const addProductToMapping = catchAsync(async (req,res,next)=>{
    const isComplete = isBodyComplete(req,["source","id","canprod_id"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    let source_table = source[req?.body?.source];

    if(!source_table) return next(
        new AppError("Invalid source value",400)
    )

    const updated_prod = await pool.query(`UPDATE ${source_table} SET canprod_id = $1 WHERE id=$2 returning *`,[req?.body?.canprod_id,req?.body?.id]);

    return res.status(200).json({
        status:"successful",
        data:{
            change:updated_prod.rows
        }
    })
});

module.exports = {
    getAllUnmappedProductsFromSource,
    getSimilarityByTitleFromSource,
    createMapping,
    addProductToMapping
}