const pool = require('../configs/postgresql.config'); // Import your database configuration
const redisClient = require('../configs/redis.config'); // Import Redis configuration

const getBackStandardQty = (qty,unit)=>{
    if(unit=='l'||unit=='kg') return qty*100;
    else return qty*1;
}

const precomputeDailyDataFNB = async (source, month, year) => {
    try {
        const canprod_ids = await pool.query(`select distinct canprod_id AS id from product_fnb;`);
        let finalData = []

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

        finalData.push({
            canprod_id:canprod_ids?.rows[i]?.id,
            products_data:[]
        });

        for(let j=0;j<products?.rows?.length;j++){
            let temp = {...products?.rows[j]};
        
            // Build the query with conditional month/year filtering
            const priceQuery = `
                SELECT 
                    p.product_id, 
                    p.price, 
                    p.date
                FROM 
                    price_fnb p
                WHERE 
                    p.product_id = $1
                    ${month && year ? `
                    AND EXTRACT(MONTH FROM p.date) = $2
                    AND EXTRACT(YEAR FROM p.date) = $3` : `
                    AND p.date = (
                        SELECT MAX(date)
                        FROM price_fnb
                        WHERE product_id = $1
                    )`}
                ORDER BY p.date DESC
                LIMIT 1;
            `;
            
            // Execute query with appropriate parameters
            const queryParams = month && year ? [temp.id, month, year] : [temp.id];
            const price = await pool.query(priceQuery, queryParams);

            if(!price?.rows || price?.rows?.length == 0){
                console.log(`No prices found for product ${temp.id} ${month && year ? `in ${month}/${year}` : ''}`);
                continue;
            }

            temp.latest_price = price.rows[0].price;
            temp.price_date = price.rows[0].date;
            temp.product_id = temp.id;

            finalData[i]?.products_data?.push(temp);
        }

        finalData[i].products_data.sort((a, b) => a.latest_price - b.latest_price);
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
        
        let cacheKey = 'daily_product_data_fnb';
        if (month && year) {
            const monthNames = {
                1: 'january', 2: 'february', 3: 'march', 4: 'april',
                5: 'may', 6: 'june', 7: 'july', 8: 'august',
                9: 'september', 10: 'october', 11: 'november', 12: 'december'
            };
            cacheKey = `daily_product_data_fnb_${monthNames[month]}_${year}`;
        }
        
        await redisClient.set(
            cacheKey, // Key to store data
            JSON.stringify(newData), // Serialize data to JSON
            'EX', 86400 // Set expiry to 24 hours (in seconds)
        );

        console.log(`Daily product data fnb successfully precomputed and cached to: ${cacheKey}`);
    } catch (error) {
        console.error('Error during precomputing daily product data:', error);
    }
};

module.exports = precomputeDailyDataFNB;
