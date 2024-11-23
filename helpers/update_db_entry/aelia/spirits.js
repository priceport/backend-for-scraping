//postgresql
const pool = require("../../../configs/postgresql.config");
const logError = require("../../logError");

//main function
const updateDBEntry = async (data) =>{
    
    let iterator = 0;
    let db_ops = 0;

    while(iterator<data?.length){

        try{
            let {url,category,title,brand,price,unit,quantity,sub_category,img,promo} = data[iterator];

            let product = await pool.query("SELECT * FROM product WHERE url = $1 and website =$2",[url,'aelia_auckland']);

            if(product.rowCount==0){
                //if no create one
                product = await pool.query(`insert into product(title,brand,description,url,image_url,qty,unit,category,sub_category,website,tag) values($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11) returning *`,[title,brand,"No desc",url,img,quantity,unit,category,sub_category,"aelia_auckland","duty-free"]);
                await pool.query(`insert into price(product_id,date,price,website) values($1, current_date, $2,$3) returning *`,[product?.rows[0]?.id,price[0].price,"aelia_auckland"]);
                //promo insertion logic
            }
            else{
                //if yes update last check
                await pool.query('update product set last_checked = current_timestamp where id= $1',[product?.rows[0]?.id]);
                await pool.query(`insert into price(product_id,date,price,website) values($1, current_date, $2, $3) returning *`,[product?.rows[0]?.id,price[0].price,"aelia_auckland"]);
            }

            if(promo)
            for(let i=0;i<promo?.length;i++){
                await pool.query(`insert into promotion(product_id,text,price,website) values($1,$2,$3,$4)`,[product?.rows[0]?.id,promo[i]?.text,promo[i]?.price,"aelia_auckland"]);
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