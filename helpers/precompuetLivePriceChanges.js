const redisClient = require("../configs/redis.config");
const pool = require('../configs/postgresql.config');

exports.precomputeLivePriceChanges = async (sourceQuery) => {
    if (!sourceQuery) {
        console.log("No source query provided");
        return [];
    }

    console.log(`Starting daily incremental price changes processing for ${sourceQuery}`);

    // Get the latest processed date from cache
    const latestProcessedDate = await getLatestProcessedDate(sourceQuery);
    console.log(`Latest processed date: ${latestProcessedDate}`);

    // Get dates that need processing
    const datesToProcess = await getDatesToProcess(latestProcessedDate);
    console.log(`Dates to process: ${datesToProcess.length} days`);

    if (datesToProcess.length === 0) {
        console.log("No new dates to process");
        return [];
    }

    // Process each date individually to minimize memory usage
    for (const targetDate of datesToProcess) {
        console.log(`Processing date: ${targetDate}`);
        await processSingleDay(sourceQuery, targetDate);
        
        // Force garbage collection after each day
        if (global.gc) {
            global.gc();
        }
    }

    console.log(`Completed processing ${datesToProcess.length} days for ${sourceQuery}`);
};

// Get the latest date that has been processed and cached
const getLatestProcessedDate = async (sourceQuery) => {
    try {
        const cachedKeys = await redisClient.keys(`live_price_changes_${sourceQuery}_*_chunk_*`);
        
        if (cachedKeys.length === 0) {
            return null;
        }

        // Extract dates from cache keys and find the latest
        const dates = cachedKeys.map(key => {
            const match = key.match(/live_price_changes_.*_(\d{4})_(\d{2})_(\d{2})_chunk_(\d+)$/);
            if (match) {
                const [year, month, day] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
                return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
            }
            return null;
        }).filter(Boolean);

        if (dates.length === 0) {
            return null;
        }

        // Return the latest date as YYYY-MM-DD string
        const latestDate = new Date(Math.max(...dates));
        return latestDate.toISOString().split('T')[0];
    } catch (error) {
        console.log("Error getting latest processed date:", error.message);
        return null;
    }
};

// Get dates that need processing (from latest processed date to yesterday)
const getDatesToProcess = async (latestProcessedDate) => {
    const dates = [];
    
    let startDate;
    if (latestProcessedDate) {
        // Start from the day after the latest processed date
        startDate = new Date(latestProcessedDate);
        startDate.setDate(startDate.getDate() + 1);
    } else {
        // If no processed date, start from the earliest date in the price table
        const earliestDateQuery = await pool.query('SELECT MIN(date) as earliest_date FROM price');
        startDate = new Date(earliestDateQuery.rows[0]?.earliest_date || new Date());
    }

    // End date is yesterday (to avoid processing today's incomplete data)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);

    // Generate all dates between start and end
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

// Process a single day's price changes
const processSingleDay = async (sourceQuery, targetDate) => {
    console.log(`Processing price changes for ${targetDate}`);

    // Fetch price changes for this specific date only
    const priceChanges = await pool.query(
        `SELECT * FROM price WHERE DATE(date) = $1 ORDER BY date ASC`,
        [targetDate]
    );

    if (!priceChanges?.rows?.length) {
        console.log(`No price changes found for ${targetDate}`);
        return;
    }

    console.log(`Found ${priceChanges.rows.length} price changes for ${targetDate}`);

    // Process in small chunks to manage memory
    const CHUNK_SIZE = 100;
    const processedData = [];

    for (let i = 0; i < priceChanges.rows.length; i += CHUNK_SIZE) {
        const chunk = priceChanges.rows.slice(i, i + CHUNK_SIZE);
        const processedChunk = await processPriceChangesChunk(chunk, sourceQuery);
        processedData.push(...processedChunk);
        
        // Log progress
        if (i % 1000 === 0) {
            console.log(`Processed ${i + chunk.length}/${priceChanges.rows.length} items for ${targetDate}`);
        }
    }

    // Save to daily cache
    await saveToDailyCache(sourceQuery, targetDate, processedData);
    console.log(`Saved ${processedData.length} items for ${targetDate}`);
};

// Process a chunk of price changes
const processPriceChangesChunk = async (priceChanges, sourceQuery) => {
    const processedItems = [];

    for (const item of priceChanges) {
        try {
            // Get product details
            const productQuery = await pool.query(
                'SELECT * FROM product WHERE id = $1',
                [item.product_id]
            );
            
            if (!productQuery.rows[0]) continue;
            
            const product = productQuery.rows[0];

            // Get previous price for this product
            const pastPriceQuery = await pool.query(
                'SELECT * FROM price WHERE product_id = $1 AND date < $2 ORDER BY date DESC LIMIT 1',
                [item.product_id, item.date]
            );

            const pastPrice = pastPriceQuery.rows[0];

            // Calculate percentage difference
            let percentageDiff = null;
            if (pastPrice && pastPrice.price > 0) {
                percentageDiff = ((item.price - pastPrice.price) / pastPrice.price) * 100;
            }

            // Get source product and price if canprod_id exists
            let sourceProduct = null;
            let sourcePrice = null;
            let percentageDiffSource = null;

            if (product.canprod_id) {
                // Get source product
                const sourceProductQuery = await pool.query(
                    'SELECT * FROM product WHERE canprod_id = $1 AND website = $2',
                    [product.canprod_id, sourceQuery]
                );
                
                sourceProduct = sourceProductQuery.rows[0];

                if (sourceProduct) {
                    // Get source price at or before this date
                    const sourcePriceQuery = await pool.query(
                        'SELECT * FROM price WHERE product_id = $1 AND date <= $2 ORDER BY date DESC LIMIT 1',
                        [sourceProduct.id, item.date]
                    );
                    
                    sourcePrice = sourcePriceQuery.rows[0];

                    if (sourcePrice && sourcePrice.price > 0) {
                        percentageDiffSource = ((item.price - sourcePrice.price) / sourcePrice.price) * 100;
                    }
                }
            }

            // Create processed item
            const processedItem = {
                title: product.title,
                brand: product.brand,
                description: product.description,
                alcohol: product.alcohol,
                canprod_id: product.canprod_id,
                url: product.url,
                image_url: product.image_url,
                qty: product.qty,
                unit: product.unit,
                created_at: product.created_at,
                last_checked: product.last_checked,
                category: product.category,
                sub_category: product.sub_category,
                product_id: product.id,
                new_price_date: item.date,
                new_price: item.price,
                old_price: pastPrice?.price || null,
                old_price_date: pastPrice?.date || null,
                percentage_diff: percentageDiff ? parseFloat(percentageDiff.toFixed(2)) : null,
                latest_source_price: sourcePrice?.price || null,
                percentage_diff_source: percentageDiffSource ? parseFloat(percentageDiffSource.toFixed(2)) : null,
                website: item.website,
                source_product: sourceProduct
            };

            processedItems.push(processedItem);
        } catch (error) {
            console.log(`Error processing item ${item.id}:`, error.message);
        }
    }

    return processedItems;
};

// Save processed data to daily cache
const saveToDailyCache = async (sourceQuery, targetDate, processedData) => {
    if (processedData.length === 0) {
        console.log(`No data to save for ${targetDate}`);
        return;
    }

    // Parse date components
    const date = new Date(targetDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Split data into chunks if needed
    const CHUNK_SIZE = 1000;
    const chunks = [];
    
    for (let i = 0; i < processedData.length; i += CHUNK_SIZE) {
        chunks.push(processedData.slice(i, i + CHUNK_SIZE));
    }

    // Save each chunk
    const savePromises = chunks.map(async (chunk, index) => {
        const chunkKey = `live_price_changes_${sourceQuery}_${year}_${month}_${day}_chunk_${index + 1}`;
        
        return redisClient.set(
            chunkKey,
            JSON.stringify(chunk),
            'EX', 86400 * 30 // 30 days expiry
        );
    });

    await Promise.all(savePromises);
    console.log(`Saved ${chunks.length} chunks for ${targetDate}`);
};