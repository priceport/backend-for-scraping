const Price = require("../../../models/priceModel");
const Product = require("../../../models/productModel");

const updateDBEntry = async (data) =>{
    
    let iterator = 1;

    while(iterator<data?.length){

        try{
            let {url,category,title,brand,source,last_check,price,unit,quantity,sub_category,img} = data[iterator];

            //check if entry for url exists
            let product = await Product.findOne({url});

            if(!product){
                //if no create one
                console.log(source);
                product = await Product.create({url,category,title,brand,source,unit,quantity,sub_category,img});
            }
            else{
                //if yes update last check
                product.last_check = last_check;
            }

            //push price
            let priceObj= {min_price:price[0]?.price, max_price:price[0]?.price, promo:price,product_ref: product?._id};

            for(let i=1;i<price?.length;i++){
                if(min_price>price[0]?.price) priceObj.min_price = price[0]?.price;
                if(max_price<price[0]?.price) priceObj.max_price = price[0]?.price;
            }

            //create and push price to product
            const priceEntry = await Price.create(priceObj);

            product.price.push(priceEntry._id);

            await product.save();
        }catch(err){
            console.log(data[iterator]);
            console.log(err);
            break;
        }

        iterator+=1;
    }
    
}

module.exports = updateDBEntry;