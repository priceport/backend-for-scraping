const pool = require("../../../configs/postgresql.config");
const Price = require("../../../models/priceModel");
const Product = require("../../../models/productModel");

const updateDBEntry = async (data) =>{
    
    let iterator = 0;
    let db_ops = 0;

    while(iterator<data?.length){

        try{
            let {url,category,title,brand,source,last_check,price,unit,quantity,sub_category,img,promo} = data[iterator];

            console.log(url);
            let product = await pool.query("SELECT * FROM product_from_heinemann_sydney WHERE url = $1",[url]);
            let price_obj;

            if(product.rowCount==0){
                //if no create one
                console.log("creating new row");
                product = await pool.query(`insert into product_from_heinemann_sydney(title,brand,description,url,image_url,qty,unit,category) values($1, $2, $3, $4, $5, $6, $7, $8) returning *`,[title,brand,"No desc",url,img,quantity,unit,category]);
            }
            else{
                //if yes update last check
                console.log("existing  row");
                await pool.query('update product_from_heinemann_sydney set last_checked = current_timestamp where id= $1',[product?.rows[0]?.id]);
            }

            await pool.query(`insert into price_from_heinemann_sydney(prod_id,date,price) values($1, current_date, $2) returning *`,[product?.rows[0]?.id,price[0].price]);

            //promo insertion logic 
            console.log("promo in product",promo);
            for(let i=0;i<promo?.length;i++){
                let p = promo[i]?.split("FOR");
                p = parseFloat(p[1]?.replace("$",""))/parseFloat(p[0]);

                if(isNaN(p)) {
                    console.log("NaN for:"+promo[i]+",result:"+p);
                    continue;
                }
              

                await pool.query(`insert into promotion_from_heinemann_sydney(prod_id,text,price) values($1,$2,$3)`,[product?.rows[0]?.id,promo[i],p]);
                // console.log(promo[i]?.split("FOR"));
            }

            db_ops+=1;
            
        }catch(err){
            console.log(data[iterator]);
            console.log(err);
            break;
        }

        iterator+=1;
    }
    
    console.log("total ops:"+db_ops);
}

module.exports = updateDBEntry;





// //check if entry for url exists
            // let product = await Product.findOne({url});

            // if(!product){
            //     //if no create one
            //     console.log(source);
            //     product = await Product.create({url,category,title,brand,source,unit,quantity,sub_category,img});
            // }
            // else{
            //     //if yes update last check
            //     product.last_check = last_check;
            // }

            // //push price
            // let priceObj= {min_price:price[0]?.price, max_price:price[0]?.price, promo:price,product_ref: product?._id};

            // for(let i=1;i<price?.length;i++){
            //     if(min_price>price[0]?.price) priceObj.min_price = price[0]?.price;
            //     if(max_price<price[0]?.price) priceObj.max_price = price[0]?.price;
            // }

            // //create and push price to product
            // const priceEntry = await Price.create(priceObj);

            // product.price.push(priceEntry._id);

            // await product.save();