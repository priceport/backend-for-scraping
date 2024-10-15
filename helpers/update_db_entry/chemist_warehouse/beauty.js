//postgresql
const pool = require("../../../configs/postgresql.config");
const logError = require("../../logError");

//main function
const updateDBEntry = async (data) =>{
    
    let iterator = 0;
    let db_ops = 0;

    while(iterator<data?.length){

        try{
            let {url,category,title,price,unit,quantity,sub_category,img} = data[iterator];

            if(isNaN(price[0].price)) {
                db_ops +=1;
                continue;
            }

            let product = await pool.query("SELECT * FROM product_from_chemist_warehouse WHERE url = $1",[url]);

            if(product.rowCount==0){
                //if no create one
                product = await pool.query(`insert into product_from_chemist_warehouse(title,description,url,image_url,qty,unit,category,sub_category) values($1, $2, $3, $4, $5, $6, $7, $8) returning *`,[title,"No desc",url,img,quantity,unit,category,sub_category]);
                await pool.query(`insert into price_from_chemist_warehouse(prod_id,date,price) values($1, current_date, $2) returning *`,[product?.rows[0]?.id,price[0].price]);
                //promo insertion logic
            }
            else{
                //if yes update last check
                await pool.query('update product_from_chemist_warehouse set last_checked = current_timestamp where id= $1',[product?.rows[0]?.id]);
                await pool.query(`insert into price_from_chemist_warehouse(prod_id,date,price) values($1, current_date, $2) returning *`,[product?.rows[0]?.id,price[0].price]);
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