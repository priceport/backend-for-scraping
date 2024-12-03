const pool = require("../../../configs/postgresql.config");
const Price = require("../../../models/priceModel");
const Product = require("../../../models/productModel");
const calculatePricePerUnit = require("../../calculatePricePerUnit");
const logError = require("../../logError");

const updateDBEntry = async (data) =>{
    
    let iterator = 0;
    let db_ops = 0;

    while(iterator<data?.length){

        try{
            let {url,category,title,brand,source,last_check,price,unit,quantity,sub_category,img,promo} = data[iterator];
            let price_per_unit = calculatePricePerUnit(price[0].price,quantity,unit);

            let product = await pool.query("SELECT * FROM product WHERE url = $1 and website = $2",[url,"aelia_queenstown"]);

            if(product.rowCount==0){
                //if no create one
                console.log("new");
                product = await pool.query(`insert into product(title,brand,description,url,image_url,qty,unit,category,website,tag) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`,[title,brand,"No desc",url,img,quantity,unit,category,"aelia_queenstown","duty-free"]);
                await pool.query(`insert into price(product_id,date,price,website,price_per_unit) values($1, current_date, $2, $3, $4) returning *`,[product?.rows[0]?.id,price[0].price,"aelia_queenstown",price_per_unit]);
                //promo insertion logic
            }
            else{
                //if yes update last check
                console.log("old");
                await pool.query('update product set last_checked = current_timestamp where id= $1',[product?.rows[0]?.id]);
                await pool.query(`insert into price(product_id,date,price,website,price_per_unit) values($1, current_date, $2, $3, $4) returning *`,[product?.rows[0]?.id,price[0].price,"aelia_queenstown",price_per_unit]);
            }

            if(promo)
            for(let i=0;i<promo?.length;i++){
                console.log("promo");
                await pool.query(`insert into promotion(product_id,text,price,website) values($1,$2,$3,$4)`,[product?.rows[0]?.id,promo[i]?.text,promo[i]?.price,"aelia_queenstown"]);
            }
            db_ops+=1;
            
        }catch(err){
            logError(err);
        }

        iterator+=1;
    }
    
    console.log("total ops:"+db_ops);
}

module.exports = updateDBEntry;