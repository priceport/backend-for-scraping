const pool = require("../../../configs/postgresql.config");
const Price = require("../../../models/priceModel");
const Product = require("../../../models/productModel");
const logError = require("../../logError");

const updateDBEntry = async (data) =>{
    
    let iterator = 0;
    let db_ops = 0;

    while(iterator<data?.length){

        try{
            let {url,category,title,brand,source,last_check,price,unit,quantity,sub_category,img,promo,promo2} = data[iterator];

            let product = await pool.query("SELECT * FROM product WHERE url = $1 and website = $2",[url,"lotte_brisbane"]);

            if(product.rowCount==0){
                //if no create one
                product = await pool.query(`insert into product(title,brand,description,url,image_url,qty,unit,category,website) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,[title,brand,"No desc",url,img,quantity,unit,category,"lotte_brisbane"]);
                
                //promo insertion logic
            }
            else{
                //if yes update last check
                await pool.query('update product set last_checked = current_timestamp where id= $1',[product?.rows[0]?.id]);
            }

            await pool.query(`insert into price(product_id,date,price,website) values($1, current_date, $2, $3) returning *`,[product?.rows[0]?.id,price[0].price,"lotte_brisbane"]);
            
            for(let i=0;i<promo?.length;i++){
                await pool.query(`insert into promotion(product_id,text,price,date,website) values($1, $2, $3, current_date,$4) returning *`,[product?.rows[0]?.id,promo[i]?.text,promo[i]?.price,"lotte_brisbane"]);
            }
            
            if(promo2)
            await pool.query(`insert into promotion(product_id,text,price,date) values($1, $2, $3, current_date, $4) returning *`,[product?.rows[0]?.id,promo2?.text,promo2?.price,"lotte_brisbane"]);

            db_ops+=1;
            
        }catch(err){
            logError(err);
            break;
        }

        iterator+=1;
    }
    
    console.log("total ops:"+db_ops);
}

module.exports = updateDBEntry;