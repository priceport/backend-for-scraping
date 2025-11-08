const pool = require("../../../configs/postgresql.config");
const calculatePricePerUnit = require("../../calculatePricePerUnit");
const logError = require("../../logError");

// Helper function to convert old URL format to new format
const convertUrlToNewFormat = (url) => {
  if (url.includes('aeliadutyfree.co.nz/auckland/')) {
    if (url.includes('www.aeliadutyfree.co.nz/auckland/')) {
      return url.replace('https://www.aeliadutyfree.co.nz/auckland/', 'https://aucklanddutyfree.co.nz/');
    } else {
      return url.replace('https://aeliadutyfree.co.nz/auckland/', 'https://aucklanddutyfree.co.nz/');
    }
  }
  return url;
};

// Main function
const updateDBEntry = async (data) => {
      let iterator = 0;
  let db_ops = 0;
  let new_prices = 0;
  let products_created = 0;
  let products_updated = 0;
  let exact_matches = 0;
  let variation_matches = 0;
  let urls_converted = 0;
  let skipped_zero_price = 0;
  let skipped_no_data = 0;
  let errors = 0;
  
  // Get subcategory from first item to track counts
  const subcategory = data[0]?.sub_category || 'unknown';
  
  // Get counts before scraping
  const beforeCount = await pool.query(
    `SELECT COUNT(*) as total, 
            SUM(CASE WHEN url LIKE '%aeliadutyfree.co.nz/auckland%' THEN 1 ELSE 0 END) as old_url_count
     FROM product 
     WHERE website = 'aelia_auckland' AND sub_category = $1`,
    [subcategory]
  );
  const totalBefore = parseInt(beforeCount.rows[0]?.total || 0);
  const oldUrlsBefore = parseInt(beforeCount.rows[0]?.old_url_count || 0);
  
  // DEDUPLICATE: Remove duplicate URLs from scraped data
  const uniqueProducts = [];
  const seenUrls = new Set();
  
  for (const item of data) {
    if (item.url && !seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      uniqueProducts.push(item);
    }
  }
  
  const duplicateCount = data.length - uniqueProducts.length;
  
  // Use deduplicated data for processing
  const processedData = uniqueProducts;
  
  while (iterator < processedData?.length) {
    try {
      let {
        url,
        category,
        title,
        brand,
        price,
        unit,
        quantity,
        sub_category,
        img,
        promo,
      } = processedData[iterator];

      // Check if product has valid data
      if (!title || !brand || !url) {
        skipped_no_data++;
        iterator += 1;
        continue;
      }
      
      if(price[0].price == 0){
        skipped_zero_price++;
        iterator += 1;
        continue;
      }

      // Try to find existing product by URL (with variations)
      const searchUrls = [url];
      
      // Add www/non-www variation
      if (url.includes('www.')) {
        searchUrls.push(url.replace('https://www.', 'https://'));
      } else {
        searchUrls.push(url.replace('https://', 'https://www.'));
      }
      
      // Convert to old format if new format (for both www and non-www)
      if (url.includes('aucklanddutyfree.co.nz/')) {
        const urlPath = url.includes('https://www.aucklanddutyfree.co.nz/') 
          ? url.replace('https://www.aucklanddutyfree.co.nz/', '')
          : url.replace('https://aucklanddutyfree.co.nz/', '');
        
        // Add old format variations
        searchUrls.push('https://www.aeliadutyfree.co.nz/auckland/' + urlPath);
        searchUrls.push('https://aeliadutyfree.co.nz/auckland/' + urlPath);
      }
      
      // Convert to new format if old format
      const newFormat = convertUrlToNewFormat(url);
      if (newFormat !== url) {
        searchUrls.push(newFormat);
      }
      
      // Try each URL variation
      let product;
      let found_match = false;
      let found_url = '';
      
      // Try each variation
      for (let i = 0; i < searchUrls.length; i++) {
        const searchUrl = searchUrls[i];
        
        const result = await pool.query(
          "SELECT id, url FROM product WHERE url = $1 AND website = $2",
          [searchUrl, "aelia_auckland"]
        );
        
        if (result.rowCount > 0) {
          product = result;
          found_match = true;
          found_url = searchUrl;
          
          if (i === 0) {
            exact_matches++;
          } else {
            variation_matches++;
          }
          break;
        }
      }
      
      // URL variation match tracking (silent)
      
      // If not found, product is undefined
      if (!product || product.rowCount === 0) {
        product = { rowCount: 0 };
      }
      let price_per_unit = calculatePricePerUnit(
        price[0].price,
        quantity,
        unit
      );

      const finalUrl = convertUrlToNewFormat(url);
      
      if (product.rowCount === 0) {
        // Create new product
        products_created++;
        product = await pool.query(
          `INSERT INTO product (title, brand, description, url, image_url, qty, unit, category, sub_category, website, tag, country)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12) RETURNING *`,
          [title, brand, "No desc", finalUrl, img, quantity, unit, category, sub_category, "aelia_auckland", "duty-free", "new zealand"]
        );
        await pool.query(
          `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
          [product?.rows[0]?.id, price[0].price, "aelia_auckland", price_per_unit]
        );
      } else {
        // Update existing product
        products_updated++;
        const oldUrl = product.rows[0].url;
        
        // Check if URL is being converted
        const isConvertingOldUrl = oldUrl.includes('aeliadutyfree.co.nz/auckland/') && !finalUrl.includes('aeliadutyfree.co.nz/auckland/');
        
        if (isConvertingOldUrl) {
          urls_converted++;
        }
        
        const latestPrice = await pool.query(
          `SELECT price FROM price WHERE product_id = $1 AND website = $2 ORDER BY date DESC, id DESC LIMIT 1`,
          [product?.rows[0]?.id, "aelia_auckland"]
        );

        // Insert new price only if changed
        if (latestPrice.rowCount === 0 || latestPrice.rows[0].price != price[0].price.toFixed(3)) {
          new_prices += 1;
          await pool.query(
            `INSERT INTO price (product_id, date, price, website, price_per_unit) VALUES ($1, current_date, $2, $3, $4)`,
            [product?.rows[0]?.id, price[0].price, "aelia_auckland", price_per_unit]
          );
        }

        // Update product with new URL format
        await pool.query(
          `UPDATE product SET last_checked = current_timestamp, country = $1, url = $2, image_url = $3, sub_category = $4 WHERE id = $5`,
          ["new zealand", finalUrl, img, sub_category, product?.rows[0]?.id]
        );
      }

      // Promo insertion logic
      if (promo) {
        for (let i = 0; i < promo?.length; i++) {
          // Skip promos with invalid prices
          if (promo[i]?.price === "Invalid input" || promo[i]?.price === null || promo[i]?.price === undefined) {
            continue;
          }
          
          await pool.query(
            `INSERT INTO promotion (product_id, text, price, website) 
                        VALUES ($1, $2, $3, $4)`,
            [
              product?.rows[0]?.id,
              promo[i]?.text,
              promo[i]?.price,
              "aelia_auckland",
            ]
          );
        }
      }

      db_ops += 1;
    } catch (err) {
      errors++;
      logError(err);
    }

    iterator += 1;
  }
  
  // Get counts after scraping
  const afterCount = await pool.query(
    `SELECT COUNT(*) as total, 
            SUM(CASE WHEN url LIKE '%aeliadutyfree.co.nz/auckland%' THEN 1 ELSE 0 END) as old_url_count
     FROM product 
     WHERE website = 'aelia_auckland' AND sub_category = $1`,
    [subcategory]
  );
  const totalAfter = parseInt(afterCount.rows[0]?.total || 0);
  const oldUrlsAfter = parseInt(afterCount.rows[0]?.old_url_count || 0);
  
  // Minimal summary
  console.log(`[${subcategory}] ${uniqueProducts.length} scraped → ${products_created} new, ${products_updated} updated | URLs converted: ${urls_converted} | Old URLs: ${oldUrlsBefore}→${oldUrlsAfter}`);
};

module.exports = updateDBEntry;
