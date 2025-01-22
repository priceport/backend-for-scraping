const pool = require('../configs/postgresql.config'); // Import your database configuration
const redisClient = require('../configs/redis.config'); // Import Redis configuration

const getBackStandardQty = (qty,unit)=>{
    if(unit=='l'||unit=='kg') return qty*100;
    else return qty*1;
}

const precomputeDailyDataFNB = async (source) => {
    try {

    const canprod_ids = await pool.query(`select distinct canprod_id AS id from product_fnb;`);
    let finalData = []
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date

    // Format dates to YYYY-MM-DD
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    for(let i=0;i<canprod_ids?.rows?.length;i++){
        const products = await pool.query(`SELECT 
        p.*,
        s.name AS store_name,
        t.name AS terminal_name
      FROM 
        product_fnb p
      LEFT JOIN 
        store s ON p.store_id = s.id
      LEFT JOIN 
        terminal t ON p.terminal_id = t.id
      WHERE 
        p.canprod_id = $1`,[canprod_ids?.rows[i]?.id]);

        // console.log(products.rows);
        finalData.push({
            canprod_id:canprod_ids?.rows[i]?.id,
            products_data:[]
        });
        
        // let source_price = 0;
        let ppuPossible = true;

        for(let j=0;j<products?.rows?.length;j++){
            let temp = {...products?.rows[j]};
        

            let price = await pool.query(`SELECT 
                p.product_id, 
                p.price, 
                p.date
            FROM 
                price_fnb p
            WHERE 
                p.date = (
                    SELECT MAX(date)
                    FROM price_fnb
                    WHERE product_id = $1
                ) AND product_id = $1;`,[temp.id]);
            // console.log(price.rows[0].price);

            if(!price?.rows || price?.rows?.length == 0){
                console.log("No prices found for:"+temp.id);
                continue;
            }

            temp.latest_price = price.rows[0].price;

            // if(temp.website == source) source_price = price.rows[0].price;

            temp.product_id = temp.id;

            // if(temp.last_checked.toISOString().split('T')[0] === todayString || temp.last_checked.toISOString().split('T')[0] === yesterdayString)
            finalData[i]?.products_data?.push(temp);
        }

        // finalData[i].source_price = parseInt(source_price);

        finalData[i].products_data.sort((a, b) => a.latest_price - b.latest_price);
        
        let prank = 1, plength = 0, lastprice=0,source_pricerank,total_price=0;

        for(let j=0;j<finalData[i]?.products_data?.length;j++){
        if(j==0){
            finalData[i].products_data[j].pricerank = `${prank}/${finalData[i]?.products_data?.length}`;
            lastprice = finalData[i].products_data[j].latest_price;
            total_price+= parseFloat(finalData[i].products_data[j].latest_price);
        }
        else{
            if(lastprice==finalData[i].products_data[j].latest_price){
                finalData[i].products_data[j].pricerank = `${prank}/${finalData[i]?.products_data?.length}`;
                plength+=1;
            }
            else{
                prank+=(1+plength);
                finalData[i].products_data[j].pricerank = `${prank}/${finalData[i]?.products_data?.length}`;
                plength=0;
                lastprice=finalData[i].products_data[j].latest_price;
            }
            total_price+= parseFloat(finalData[i].products_data[j].latest_price);
        }

        // if(finalData[i].products_data[j].website==source) source_pricerank = parseInt(finalData[i].products_data[j].pricerank?.split("/")[0]);
        }
        finalData[i].average = total_price / finalData[i]?.products_data?.length;
        // finalData[i].source_pricerank = source_pricerank;
    }

        finalData = finalData?.filter(data=>data.products_data.length!==0);

        let newData = [];
        finalData?.forEach(data=>{
            data?.products_data?.forEach(product=>{
                console.log(product?.terminal_name);
                if(product?.terminal_name!="OTHERS"){
                    newData.push({...data,store_name:product?.store_name,store_price:product?.latest_price,product_name:product?.name,terminal_name:product?.terminal_name,store_pricerank:product?.pricerank,difference:(parseFloat(product?.latest_price)-parseFloat(data?.average)),difference_percentage:((parseFloat(product?.latest_price)-parseFloat(data?.average))/parseFloat(product?.latest_price))*100})
                }
            })
        });

        // newData?.forEach(data=>console.log(data));
        // Store the result in Redis
        await redisClient.set(
            'daily_product_data_fnb', // Key to store data
            JSON.stringify(newData), // Serialize data to JSON
            'EX', 86400 // Set expiry to 24 hours (in seconds)
        );

        console.log('Daily product data fnb successfully precomputed and cached!');
    } catch (error) {
        console.error('Error during precomputing daily product data:', error);
    }
};

module.exports = precomputeDailyDataFNB;
