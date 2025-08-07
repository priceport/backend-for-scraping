const redisClient = require("../configs/redis.config");
const pool = require('../configs/postgresql.config');

exports.precomputeLivePriceChanges = async (sourceQuery)=>{

    if(!sourceQuery){
        console.log("No source query provided");
        return [];
    }

    // Get the latest cached month for this sourceQuery
    let latestCachedDate = null;
    try {
        const cachedKeys = await redisClient.keys(`live_price_changes_${sourceQuery}_*`);
        if (cachedKeys.length > 0) {
            // Extract dates from cache keys and find the latest
            const dates = cachedKeys.map(key => {
                const match = key.match(/live_price_changes_.*_([a-z]+)_(\d{4})$/);
                if (match) {
                    const month = match[1];
                    const year = parseInt(match[2]);
                    return { month, year, key };
                }
                return null;
            }).filter(Boolean);

            if (dates.length > 0) {
                // Sort by year and month to find the latest
                dates.sort((a, b) => {
                    if (a.year !== b.year) return b.year - a.year;
                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    return months.indexOf(b.month) - months.indexOf(a.month);
                });
                
                const latest = dates[0];
                // Get the first day of the next month after the latest cached month
                const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                const monthIndex = months.indexOf(latest.month);
                let nextMonth = monthIndex + 1;
                let nextYear = latest.year;
                
                if (nextMonth >= 12) {
                    nextMonth = 0;
                    nextYear++;
                }
                
                latestCachedDate = new Date(nextYear, nextMonth, 1);
                console.log(`Latest cached month: ${latest.month}_${latest.year}, starting from: ${latestCachedDate.toISOString()}`);
            }
        }
    } catch (error) {
        console.log("Error checking cached keys:", error.message);
    }

    // Fetch price changes based on latest cached date
    let priceChanges;
    if (latestCachedDate) {
        console.log(`Fetching price changes from ${latestCachedDate.toISOString()}`);
        priceChanges = await pool.query(`select * from price where date >= $1 order by date asc`, [latestCachedDate]);
    } else {
        console.log("No cached data found, fetching all price changes");
        priceChanges = await pool.query(`select * from price order by date asc`, []);
    }

    if (!priceChanges?.rows?.length) {
        console.log("No new price changes to process");
        return [];
    }

    console.log(`Processing ${priceChanges.rows.length} price changes from ${priceChanges.rows[0]?.date} to ${priceChanges.rows[priceChanges.rows.length-1]?.date}`);

    const productCache = {};
    const sourceProductCache = {};
    const sourcePriceCache = {};

    // Process data in chunks and save month-wise
    const monthlyData = {};
    let processedCount = 0;
    let totalNewItems = 0;

    for(let i = 0; i < priceChanges?.rows?.length; i += 100){
        console.log(`Processing batch ${i} to ${Math.min(i + 100, priceChanges.rows.length)}`);
        const curItems = priceChanges?.rows?.slice(i, i + 100);
        
        let processedItems = await Promise.all(curItems?.map(async item => {
            if(productCache[item?.product_id]){ 
                return {...item, product: productCache[item?.product_id]}
            } else {
                let product = await pool.query(`select * from product where id = $1`,[item?.product_id]);
                let past_price = await pool.query('select * from price where product_id = $1 and date < $2 order by date desc limit 1',[item?.product_id, item?.date]);
    
                product = {...product?.rows[0], past_price: past_price?.rows[0]};
                
                if(product?.canprod_id){
                    let sourceProduct = null;
                    if(!sourceProductCache[`${product?.canprod_id}_${sourceQuery}`]){
                        sourceProduct = await pool.query(`select * from product where canprod_id = $1 and website = $2`,[product?.canprod_id,sourceQuery]);
                        sourceProductCache[`${product?.canprod_id}_${sourceQuery}`] = sourceProduct;
                    } else {
                        sourceProduct = sourceProductCache[`${product?.canprod_id}_${sourceQuery}`];
                    }

                    let sourcePrice = null;
                    if(!sourcePriceCache[`${sourceProduct?.rows[0]?.id}_${item?.date}`]){
                        sourcePrice = await pool.query(`select * from price where product_id = $1 and date <= $2 order by date desc limit 1`,[sourceProduct?.rows[0]?.id, item?.date]);
                        sourcePriceCache[`${sourceProduct?.rows[0]?.id}_${item?.date}`] = sourcePrice;
                    } else {
                        sourcePrice = sourcePriceCache[`${sourceProduct?.rows[0]?.id}_${item?.date}`];
                    }
                    
                    product = {...product, sourceProduct:sourceProduct?.rows[0]?sourceProduct?.rows[0]:null, sourcePrice: sourcePrice?.rows[0]?sourcePrice?.rows[0]:null,diff_value:((item?.price - product?.past_price?.price)/product?.past_price?.price)*100, diff_value_source:((item?.price - sourcePrice?.rows[0]?.price)/sourcePrice?.rows[0]?.price)*100}
                }
                
                productCache[item?.product_id] = product;
                return {...item, product: productCache[item?.product_id]}
            }
        }));

        // Transform and group by month immediately
        processedItems = processedItems.map(item => ({
            title: item?.product?.title,
            brand: item?.product?.brand,
            description: item?.product?.description,
            alcohol: item?.product?.alcohol,
            canprod_id: item?.product?.canprod_id,
            url: item?.product?.url,
            image_url: item?.product?.image_url,
            qty: item?.product?.qty,
            unit: item?.product?.unit,
            created_at: item?.product?.created_at,
            last_checked: item?.product?.last_checked,
            category: item?.product?.category,
            sub_category: item?.product?.sub_category,
            product_id: item?.product?.id,
            new_price_date: item?.date,
            new_price: item?.price,
            old_price: item?.product?.past_price?.price,
            old_price_date: item?.product?.past_price?.date,
            percentage_diff: item?.product?.diff_value,
            latest_source_price: item?.product?.sourcePrice?.price,
            percentage_diff_source: item?.product?.diff_value_source,
            website: item?.website,
            source_product: item?.product?.sourceProduct,
        }));

        // Group by month and add to monthlyData
        let newItemsInBatch = 0;
        processedItems.forEach(item => {
            if (item.new_price_date) {
                const date = new Date(item.new_price_date);
                const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
                const year = date.getFullYear();
                const key = `${month}_${year}`;
                
                if (!monthlyData[key]) {
                    monthlyData[key] = [];
                }
                monthlyData[key].push(item);
                newItemsInBatch++;
            }
        });

        processedCount += processedItems.length;
        totalNewItems += newItemsInBatch;
        console.log(`Processed ${processedCount}/${priceChanges.rows.length} items. New items in batch: ${newItemsInBatch}. Total new items: ${totalNewItems}. Memory usage: ${Object.keys(monthlyData).length} months`);

        // Save to cache every 10,000 items to prevent memory buildup
        if (processedCount % 10000 === 0) {
            await saveMonthlyDataToCache(monthlyData, sourceQuery);
            console.log(`Saved intermediate data to cache at ${processedCount} items (${totalNewItems} new items total)`);
            
            // Clear monthlyData to prevent double-counting in next batch
            Object.keys(monthlyData).forEach(key => {
                monthlyData[key] = [];
            });
            console.log(`Cleared monthlyData to prevent double-counting`);
        }
    }

    console.log('All data processed. Saving final data to cache...');

    // Save final data to cache
    await saveMonthlyDataToCache(monthlyData, sourceQuery);

    console.log("Live price changes precomputed and cached by month!");
    console.log(`Updated/created months: ${Object.keys(monthlyData).join(' → ')}`);
    console.log(`Total processed: ${processedCount}, Total new items: ${totalNewItems}`);
};

// Helper function to save monthly data to cache
const saveMonthlyDataToCache = async (monthlyData, sourceQuery) => {
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const [monthA, yearA] = a.split('_');
        const [monthB, yearB] = b.split('_');
        
        if (parseInt(yearA) !== parseInt(yearB)) {
            return parseInt(yearA) - parseInt(yearB);
        }
        
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return months.indexOf(monthA) - months.indexOf(monthB);
    });

    const cachePromises = sortedMonths.map(async (monthYear) => {
        const cacheKey = `live_price_changes_${sourceQuery}_${monthYear}`;
        
        // If this month already exists in cache, merge with existing data
        let existingData = [];
        let existingCount = 0;
        try {
            const existingCache = await redisClient.get(cacheKey);
            if (existingCache) {
                existingData = JSON.parse(existingCache);
                existingCount = existingData.length;
                console.log(`Found existing data for ${monthYear}: ${existingCount} items`);
            }
        } catch (error) {
            console.log(`Error fetching existing cache for ${monthYear}:`, error.message);
        }
        
        // Merge existing and new data, removing duplicates based on product_id and new_price_date
        const mergedData = [...existingData];
        const existingKeys = new Set(existingData.map(item => `${item.product_id}_${item.new_price_date}`));
        
        let newItemsCount = 0;
        monthlyData[monthYear].forEach(newItem => {
            const key = `${newItem.product_id}_${newItem.new_price_date}`;
            if (!existingKeys.has(key)) {
                mergedData.push(newItem);
                existingKeys.add(key);
                newItemsCount++;
            }
        });
        
        // Sort merged data by date to maintain chronological order
        mergedData.sort((a, b) => new Date(a.new_price_date) - new Date(b.new_price_date));
        
        console.log(`Caching ${mergedData.length} items for ${monthYear} (${newItemsCount} new items, ${existingCount} existing)`);
        
        return redisClient.set(
            cacheKey,
            JSON.stringify(mergedData),
            'EX', 86400 // Set expiry to 24 hours (in seconds)
        );
    });

    await Promise.all(cachePromises);
};