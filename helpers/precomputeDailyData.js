const pool = require('../configs/postgresql.config'); // Import your database configuration
const redisClient = require('../configs/redis.config'); // Import Redis configuration
const { getWrongMappings } = require('./getWrongMappings');

const getBackStandardQty = (qty,unit)=>{
    if(unit=='l'||unit=='kg') return qty*100;
    else return qty*1;
}

const bulkUpdateAICheck = async (updates) => {
    if (!Array.isArray(updates) || updates.length === 0) {
        return [];
    }

    const allowedValues = ['', 'no', 'likely', 'yes'];
    
    // Validate input data
    for (const item of updates) {
        if (!item.id || !allowedValues.includes(item.ai_check)) {
            throw new Error('Invalid input data: Each object must have a valid id and ai_check value');
        }
    }

    // Construct bulk update query
    const query = `
        UPDATE product AS p
        SET ai_check = c.ai_check
        FROM (VALUES ${updates.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}) 
        AS c(id, ai_check)
        WHERE p.id = c.id::INTEGER
        RETURNING p.*;
    `;

    // Flatten values for parameterized query
    const values = updates.flatMap(({ id, ai_check }) => [id, ai_check]);

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error updating ai_check:', error);
        throw error;
    }
};

async function checkForWrongMappings (products){
    try{
        for(let i = 0;i<products?.length;i++){
            console.log(i);
            let main = products[i]?.products_data?.find(el=>el?.website=="aelia_auckland");
            let candidateProducts = products[i]?.products_data?.filter(el=>el?.website!='aelia_auckland');

            if(!main){
                console.log("something went wrong for canprod_id="+products[i]?.canprod_id);
                continue;
            }

            const wrongObjects = await getWrongMappings(main,candidateProducts);

            await bulkUpdateAICheck(wrongObjects);
        }
    }catch(err){
        console.log(err);
    }
}
function isTodayOrYesterday(timestamp) {
    const inputDate = new Date(timestamp);
    const today = new Date();

    // Check if the date is today
    const isToday =
        inputDate.getDate() === today.getDate() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getFullYear() === today.getFullYear();

    // Check if the date is yesterday
    const yesterday = new Date();
    const daybeforeyesterday = new Date();
    yesterday.setDate(today.getDate() - 2);
    daybeforeyesterday.setDate(today.getDate() - 3);

    const isYesterday =
        inputDate.getDate() === yesterday.getDate() &&
        inputDate.getMonth() === yesterday.getMonth() &&
        inputDate.getFullYear() === yesterday.getFullYear();

    const isDayBeforeYesterday =
        inputDate.getDate() === daybeforeyesterday.getDate() &&
        inputDate.getMonth() === daybeforeyesterday.getMonth() &&
        inputDate.getFullYear() === daybeforeyesterday.getFullYear();

    return isDayBeforeYesterday || isYesterday; // Return true if it's either today or yesterday
}

const precomputeDailyData = async (source) => {
    try {

    const canprod_ids = await pool.query(`select * from cannonical_product;`);
    let finalData = []
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date

    // Format dates to YYYY-MM-DD
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    for(let i=0;i<canprod_ids?.rows?.length;i++){
        const products = await pool.query(`select * from product where canprod_id=$1`,[canprod_ids?.rows[i]?.id]);

        finalData.push({
            canprod_id:canprod_ids?.rows[i]?.id,
            products_data:[]
        });
        
        let source_price = 0;
        let ppuPossible = true;

        for(let j=0;j<products?.rows?.length;j++){
            let temp = {...products?.rows[j]};
        

            let price = await pool.query(`SELECT 
                p.product_id, 
                p.price, 
                p.date, 
                p.website
            FROM 
                price p
            WHERE 
                p.date = (
                    SELECT MAX(date)
                    FROM price
                    WHERE product_id = $1
                ) AND product_id = $1;`,[temp.id]);
            // console.log(price.rows[0].price);

            if(!price?.rows || price?.rows?.length == 0){
                console.log("No prices found for:"+temp.id);
                continue;
            }

            temp.latest_price = price.rows[0].price;

            if(temp.website == source) source_price = price.rows[0].price;

            let promotions = await pool.query(`SELECT 
                *
            FROM 
                promotion p
            WHERE 
                p.date::DATE = CURRENT_DATE - 1 AND product_id = $1;`,[temp.id]);

            temp.latest_promotions = promotions.rows;
            
            if(temp.latest_price&&temp.qty&&temp.unit){
            temp.price_per_unit = temp.latest_price/getBackStandardQty(temp.qty,temp.unit);
            }
            else{ 
            temp.price_per_unit = null;
            ppuPossible = false;
            }

            temp.product_id = temp.id;

            // if(temp.last_checked.toISOString().split('T')[0] === todayString || temp.last_checked.toISOString().split('T')[0] === yesterdayString)
            finalData[i]?.products_data?.push(temp);
        }

        finalData[i].source_price = parseInt(source_price);

        if(ppuPossible)finalData[i].products_data.sort((a, b) => a.price_per_unit - b.price_per_unit);
        else finalData[i].products_data.sort((a, b) => a.latest_price - b.latest_price);
        
        let prank = 1, plength = 0, lastprice=0,source_pricerank;

        for(let j=0;j<finalData[i]?.products_data?.length;j++){
        if(j==0){
            finalData[i].products_data[j].pricerank = `${prank}/${finalData[i]?.products_data?.length}`;
            if(ppuPossible) lastprice = finalData[i].products_data[j].price_per_unit;
            else lastprice = finalData[i].products_data[j].latest_price;
        }
        else{
            if(ppuPossible){
            if(lastprice==finalData[i].products_data[j].price_per_unit){
                finalData[i].products_data[j].pricerank = `${prank}/${finalData[i]?.products_data?.length}`;
                plength+=1;
            }
            else{
                prank+=(1+plength);
                finalData[i].products_data[j].pricerank = `${prank}/${finalData[i]?.products_data?.length}`;
                plength=0;
                lastprice=finalData[i].products_data[j].price_per_unit;
            }
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
            }
        }

        if(finalData[i].products_data[j].website==source) source_pricerank = parseInt(finalData[i].products_data[j].pricerank?.split("/")[0]);
        }

        finalData[i].source_pricerank = source_pricerank;
    }
        // Query to fetch all product data without filters
        // const data = await pool.query(`
        // WITH latest_promotions AS (
        //     SELECT
        //         promo.product_id,
        //         JSON_AGG(
        //             JSON_BUILD_OBJECT(
        //                 'date', promo.date,
        //                 'text', promo.text,
        //                 'price', promo.price
        //             )
        //         ) AS promotions
        //     FROM promotion promo
        //     WHERE promo.date = (
        //         SELECT MAX(promo_inner.date)
        //         FROM promotion promo_inner
        //         WHERE promo_inner.product_id = promo.product_id
        //     )
        //     GROUP BY promo.product_id
        // ),
        // latest_batch AS (
        //     SELECT
        //         pr.canprod_id,
        //         MAX(pr.date) AS latest_date
        //     FROM product_price_rank pr
        //     GROUP BY pr.canprod_id
        // ),
        // filtered_rank AS (
        //     SELECT
        //         pr.*
        //     FROM product_price_rank pr
        //     JOIN latest_batch lb ON pr.canprod_id = lb.canprod_id AND pr.date = lb.latest_date
        // ),
        // source_products AS (
        //     SELECT
        //         p.canprod_id,
        //         pr.product_id,
        //         pr.website,
        //         pr.price_rank,
        //         p.brand,
        //         p.category,
        //         pr.date
        //     FROM product p
        //     JOIN filtered_rank pr ON p.id = pr.product_id
        //     WHERE pr.website = $1 -- Source website
        // )
        // SELECT 
        //     cp.id AS canprod_id,
        //     JSON_AGG(
        //         JSON_BUILD_OBJECT(
        //             'qty', p.qty,
        //             'url', p.url,
        //             'unit', p.unit,
        //             'brand', p.brand,
        //             'title', p.title,
        //             'website', pr.website,
        //             'category', p.category,
        //             'image_url', p.image_url,
        //             'pricerank', CONCAT(pr.price_rank, '/', pr.total_peers),
        //             'product_id', p.id,
        //             'description', COALESCE(p.description, 'No desc'),
        //             'latest_price', pr.price,
        //             'sub_category', p.sub_category,
        //             'latest_promotions', COALESCE(lp.promotions, '[]'::JSON)
        //         )
        //     ) AS products_data,
        //     MAX(CASE WHEN pr.website = $1 THEN pr.price_rank END) AS source_pricerank,
        //     MAX(CASE WHEN pr.website = $1 THEN pr.price END) AS source_price
        // FROM 
        //     cannonical_product cp
        // JOIN 
        //     product p ON cp.id = p.canprod_id
        // JOIN 
        //     filtered_rank pr ON p.id = pr.product_id
        // LEFT JOIN 
        //     latest_promotions lp ON lp.product_id = p.id
        // JOIN 
        //     source_products sp ON sp.canprod_id = p.canprod_id 
        //                       AND sp.date = pr.date -- Ensure peers belong to the same batch as the source
        // WHERE 
        //     p.canprod_id IS NOT NULL
        // GROUP BY 
        //     cp.id;  
        // `,[source]);

        finalData = finalData?.filter(data=>{

            const el = data.products_data.find(d=>d.website == source);

            if(!el||!isTodayOrYesterday(el.last_checked)) return false;

            data.products_data = data.products_data.filter(d=>isTodayOrYesterday(d.last_checked));

            return data.products_data.length!==0
        });

        console.log("product length for today is:"+finalData?.length);
        // Store the result in Redis
        await redisClient.set(
            'daily_product_data', // Key to store data
            JSON.stringify(finalData), // Serialize data to JSON
            'EX', 86400 // Set expiry to 24 hours (in seconds)
        );

        await checkForWrongMappings(finalData);

        console.log('Daily product data successfully precomputed and cached!');
    } catch (error) {
        console.error('Error during precomputing daily product data:', error);
    }
};

module.exports = precomputeDailyData;
