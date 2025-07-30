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
        
        // Remove the old total_price calculation as it's not needed and causing issues
        // The average will be calculated correctly in the final loop below
    }

        finalData = finalData?.filter(data=>data.products_data.length!==0);

        let newData = [];
        finalData?.forEach(data=>{
            // Calculate the average price of all products in this group
            const totalPrice = data.products_data.reduce((sum, product) => sum + parseFloat(product.latest_price), 0);
            const averagePrice = data.products_data.length > 0 ? totalPrice / data.products_data.length : 0;
            
            // Debug logs
            console.log('=== DEBUG CALCULATION ===');
            console.log('canprod_id:', data.canprod_id);
            console.log('Number of products:', data.products_data.length);
            console.log('Prices:', data.products_data.map(p => p.latest_price));
            console.log('Total price calculated:', totalPrice);
            console.log('Average price calculated:', averagePrice);
            console.log('Old total_price from data:', data.total_price);
            console.log('========================');
            
            data?.products_data?.forEach(product=>{
                if(product?.terminal_name!="OTHERS"){
                    const difference = parseFloat(product?.latest_price) - averagePrice;
                    const difference_percentage = product?.latest_price > 0 ? (difference / parseFloat(product?.latest_price)) * 100 : 0;
                    
                    // Debug for this specific product
                    console.log(`Product: ${product.name}, Price: ${product.latest_price}, Difference: ${difference}, Percentage: ${difference_percentage}%`);
                    
                    newData.push({
                        canprod_id: data.canprod_id,
                        products_data: data.products_data,
                        total_price: totalPrice, // Use the correctly calculated total
                        average: averagePrice,
                        store_name: product?.store_name,
                        store_price: product?.latest_price,
                        product_name: product?.name,
                        terminal_name: product?.terminal_name,
                        store_pricerank: product?.pricerank,
                        difference: difference,
                        difference_percentage: difference_percentage
                    });
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
