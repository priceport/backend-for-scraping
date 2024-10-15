//postgresql
const pool = require("../../../configs/postgresql.config");
const logError = require("../../logError");

//main function
const updateDBEntry = async (data) =>{
    
    let iterator = 0;
    let db_ops = 0;

    while(iterator<data?.length){

        try{
            let {url,category,title,brand,source,last_check,price,unit,quantity,sub_category,img,promo} = data[iterator];

            let product = await pool.query("SELECT * FROM product_from_heinemann_sydney WHERE url = $1",[url]);

            if(product.rowCount==0){
                //if no create one
                product = await pool.query(`insert into product_from_heinemann_sydney(title,brand,description,url,image_url,qty,unit,category,sub_category) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,[title,brand,"No desc",url,img,quantity,unit,category,sub_category]);
            }
            else{
                //if yes update last check
                await pool.query('update product_from_heinemann_sydney set last_checked = current_timestamp where id= $1',[product?.rows[0]?.id]);
            }

            await pool.query(`insert into price_from_heinemann_sydney(prod_id,date,price) values($1, current_date, $2) returning *`,[product?.rows[0]?.id,price[0].price]);

            //promo insertion logic 
            for(let i=0;i<promo?.length;i++){

                if(promo[i]?.includes("FOR")){
                    let p = promo[i]?.split("FOR");
                    p = parseFloat(p[1]?.replace("$",""))/parseFloat(p[0]);
    
                    if(isNaN(p)) {
                        continue;
                    }
                  
                    await pool.query(`insert into promotion_from_heinemann_sydney(prod_id,text,price) values($1,$2,$3)`,[product?.rows[0]?.id,promo[i],p]);
                }
                else if(promo[i]?.includes("SAVE")){
                    let p = price[0]?.price * ((100 - parseFloat(promo[i].split(" ")[4]?.replace("%","")))/100);

                    if(isNaN(p)) {
                        continue;
                    }

                    await pool.query(`insert into promotion_from_heinemann_sydney(prod_id,text,price) values($1,$2,$3)`,[product?.rows[0]?.id,promo[i],p]);
                }
            }

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