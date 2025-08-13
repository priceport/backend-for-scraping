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
        const cachedKeys = await redisClient.keys(`live_price_changes_${sourceQuery}_*_chunk_*`);
        if (cachedKeys.length > 0) {
            // Extract dates from cache keys and find the latest
            const dates = cachedKeys.map(key => {
                const match = key.match(/live_price_changes_.*_([a-z]+)_(\d{4})_chunk_(\d+)$/);
                if (match) {
                    const month = match[1];
                    const year = parseInt(match[2]);
                    const chunk = parseInt(match[3]);
                    return { month, year, chunk, key };
                }
                return null;
            }).filter(Boolean);

            if (dates.length > 0) {
                // Group by month to check completeness
                const monthGroups = {};
                dates.forEach(date => {
                    const monthKey = `${date.month}_${date.year}`;
                    if (!monthGroups[monthKey]) {
                        monthGroups[monthKey] = [];
                    }
                    monthGroups[monthKey].push(date);
                });

                // Find the latest month and check if it's complete
                const sortedMonths = Object.keys(monthGroups).sort((a, b) => {
                    const [monthA, yearA] = a.split('_');
                    const [monthB, yearB] = b.split('_');
                    
                    if (parseInt(yearA) !== parseInt(yearB)) {
                        return parseInt(yearB) - parseInt(yearA);
                    }
                    
                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    return months.indexOf(monthB) - months.indexOf(monthA);
                });

                const latestMonthKey = sortedMonths[0];
                const latestMonthChunks = monthGroups[latestMonthKey];
                
                // Sort chunks for the latest month
                latestMonthChunks.sort((a, b) => a.chunk - b.chunk);
                
                const latestChunk = latestMonthChunks[latestMonthChunks.length - 1];
                const [latestMonth, latestYear] = latestMonthKey.split('_');
                
                // Check if the latest month might be incomplete
                // If the latest chunk has fewer than MONTH_CHUNK_SIZE items, it might be incomplete
                let isLatestMonthComplete = false;
                try {
                    const latestChunkData = await redisClient.get(latestChunk.key);
                    if (latestChunkData) {
                        const chunkItems = JSON.parse(latestChunkData);
                        // If the latest chunk has exactly MONTH_CHUNK_SIZE items, it's likely complete
                        // If it has fewer, it might be incomplete
                        isLatestMonthComplete = chunkItems.length === 10000;
                    }
                } catch (error) {
                    console.log("Error checking latest chunk completeness:", error.message);
                }

                if (isLatestMonthComplete) {
                    // Latest month is complete, start from next month
                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    const monthIndex = months.indexOf(latestMonth);
                    let nextMonth = monthIndex + 1;
                    let nextYear = parseInt(latestYear);
                    
                    if (nextMonth >= 12) {
                        nextMonth = 0;
                        nextYear++;
                    }
                    
                    latestCachedDate = new Date(nextYear, nextMonth, 1);
                    console.log(`Latest month ${latestMonth}_${latestYear} is complete, starting from: ${latestCachedDate.toISOString()}`);
                } else {
                    // Latest month might be incomplete, redo it from the beginning
                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    const monthIndex = months.indexOf(latestMonth);
                    latestCachedDate = new Date(parseInt(latestYear), monthIndex, 1);
                    
                    // Delete all chunks for this month to redo it
                    console.log(`Latest month ${latestMonth}_${latestYear} appears incomplete, redoing from: ${latestCachedDate.toISOString()}`);
                    for (const chunk of latestMonthChunks) {
                        await redisClient.del(chunk.key);
                        console.log(`Deleted ${chunk.key}`);
                    }
                }
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

    // Process in very small chunks and save immediately
    const CHUNK_SIZE = 20; // Very small chunks
    const SAVE_INTERVAL = 100; // Save every 100 items
    const MONTH_CHUNK_SIZE = 10000; // Max items per month chunk
    let processedCount = 0;
    let totalNewItems = 0;
    let currentMonthData = {}; // Only keep current month in memory

    for(let i = 0; i < priceChanges?.rows?.length; i += CHUNK_SIZE){
        const curItems = priceChanges?.rows?.slice(i, i + CHUNK_SIZE);
        
        // Process small chunk
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

        // Transform items
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

        // Group by month and add to current month data
        let newItemsInChunk = 0;
        processedItems.forEach(item => {
            if (item.new_price_date) {
                const date = new Date(item.new_price_date);
                const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
                const year = date.getFullYear();
                const key = `${month}_${year}`;
                
                if (!currentMonthData[key]) {
                    currentMonthData[key] = [];
                }
                currentMonthData[key].push(item);
                newItemsInChunk++;
            }
        });

        processedCount += processedItems.length;
        totalNewItems += newItemsInChunk;

        // Save to cache frequently
        if (processedCount % SAVE_INTERVAL === 0) {
            await saveCurrentMonthDataToChunks(currentMonthData, sourceQuery, MONTH_CHUNK_SIZE);
            console.log(`Saved at ${processedCount}/${priceChanges.rows.length} items (${totalNewItems} new items total)`);
            
            // Clear current month data to free memory
            currentMonthData = {};
            
            // Force garbage collection
            if (global.gc) {
                global.gc();
            }
        }
    }

    // Save any remaining data
    if (Object.keys(currentMonthData).length > 0) {
        await saveCurrentMonthDataToChunks(currentMonthData, sourceQuery, MONTH_CHUNK_SIZE);
    }

    console.log("Live price changes precomputed and cached by month chunks!");
    console.log(`Total processed: ${processedCount}, Total new items: ${totalNewItems}`);
};

// Helper function to save current month data to chunks
const saveCurrentMonthDataToChunks = async (currentMonthData, sourceQuery, chunkSize) => {
    const sortedMonths = Object.keys(currentMonthData).sort((a, b) => {
        const [monthA, yearA] = a.split('_');
        const [monthB, yearB] = b.split('_');
        
        if (parseInt(yearA) !== parseInt(yearB)) {
            return parseInt(yearA) - parseInt(yearB);
        }
        
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return months.indexOf(monthA) - months.indexOf(monthB);
    });

    const cachePromises = sortedMonths.map(async (monthYear) => {
        const monthData = currentMonthData[monthYear];
        
        // Get existing chunks for this month
        const existingChunkKeys = await redisClient.keys(`live_price_changes_${sourceQuery}_${monthYear}_chunk_*`);
        let existingData = [];
        
        // Load all existing data for this month
        for (const key of existingChunkKeys) {
            try {
                const existingCache = await redisClient.get(key);
                if (existingCache) {
                    const chunkData = JSON.parse(existingCache);
                    existingData.push(...chunkData);
                }
            } catch (error) {
                console.log(`Error fetching existing cache for ${key}:`, error.message);
            }
        }
        
        // Merge with new data
        const mergedData = [...existingData];
        const existingKeys = new Set(existingData.map(item => `${item.product_id}_${item.new_price_date}`));
        
        let newItemsCount = 0;
        monthData.forEach(newItem => {
            const key = `${newItem.product_id}_${newItem.new_price_date}`;
            if (!existingKeys.has(key)) {
                mergedData.push(newItem);
                existingKeys.add(key);
                newItemsCount++;
            }
        });
        
        // Sort by date
        mergedData.sort((a, b) => new Date(a.new_price_date) - new Date(b.new_price_date));
        
        // Split into chunks
        const chunks = [];
        for (let i = 0; i < mergedData.length; i += chunkSize) {
            chunks.push(mergedData.slice(i, i + chunkSize));
        }
        
        console.log(`Saving ${mergedData.length} items for ${monthYear} in ${chunks.length} chunks (${newItemsCount} new items)`);
        
        // Save each chunk
        const chunkPromises = chunks.map(async (chunk, index) => {
            const chunkKey = `live_price_changes_${sourceQuery}_${monthYear}_chunk_${index + 1}`;
            return redisClient.set(
                chunkKey,
                JSON.stringify(chunk),
                'EX', 86400
            );
        });
        
        await Promise.all(chunkPromises);
        
        // Delete old chunks if we have fewer chunks now
        if (existingChunkKeys.length > chunks.length) {
            for (let i = chunks.length + 1; i <= existingChunkKeys.length; i++) {
                const oldKey = `live_price_changes_${sourceQuery}_${monthYear}_chunk_${i}`;
                await redisClient.del(oldKey);
            }
        }
    });

    await Promise.all(cachePromises);
};