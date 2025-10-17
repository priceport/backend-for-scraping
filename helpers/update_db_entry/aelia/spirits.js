const pool = require("../../../configs/postgresql.config");
const calculatePricePerUnit = require("../../calculatePricePerUnit");
const logError = require("../../logError");

// Main function
const updateDBEntry = async (data) => {
  let iterator = 0;
  let db_ops = 0;
  let new_prices = 0;
  while (iterator < data?.length) {
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
      } = data[iterator];

      if(price[0].price == 0){
        iterator += 1;
        continue;
      }

      
      let product = await pool.query(
        "SELECT * FROM product WHERE url = $1 AND website = $2",
        [url, "aelia_auckland"]
      );

      if (product.rowCount === 0) {
        const urlNoWww = url.replace(
          'https://www.aucklanddutyfree.co.nz/',
          'https://aucklanddutyfree.co.nz/'
        );
        
        product = await pool.query(
          "SELECT * FROM product WHERE url = $1 AND website = $2",
          [urlNoWww, "aelia_auckland"]
        );
        
        if (product.rowCount === 0) {
          const oldUrlPattern = url.replace(
            'https://www.aucklanddutyfree.co.nz/',
            'https://www.aeliadutyfree.co.nz/auckland/'
          );
          
          product = await pool.query(
            "SELECT * FROM product WHERE url = $1 AND website = $2",
            [oldUrlPattern, "aelia_auckland"]
          );
        }
        
        // Try 3: Old Aelia format without www
        if (product.rowCount === 0) {
          const oldUrlPatternNoWww = url.replace(
            'https://www.aucklanddutyfree.co.nz/',
            'https://aeliadutyfree.co.nz/auckland/'
          );
          
          product = await pool.query(
            "SELECT * FROM product WHERE url = $1 AND website = $2",
            [oldUrlPatternNoWww, "aelia_auckland"]
          );
        }
      }
      let price_per_unit = calculatePricePerUnit(
        price[0].price,
        quantity,
        unit
      );

      if (product.rowCount === 0) {
        console.log(`[NEW] Creating: ${title.substring(0, 50)}`);
        product = await pool.query(
          `INSERT INTO product (title, brand, description, url, image_url, qty, unit, category, sub_category, website, tag, country)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12) RETURNING *`,
          [
            title,
            brand,
            "No desc",
            url,
            img,
            quantity,
            unit,
            category,
            sub_category,
            "aelia_auckland",
            "duty-free",
            "new zealand",
          ]
        );
        await pool.query(
          `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
          [
            product?.rows[0]?.id,
            price[0].price,
            "aelia_auckland",
            price_per_unit,
          ]
        );
      } else {
        // UPDATE EXISTING PRODUCT
        console.log(`[UPDATE] Updating ID ${product.rows[0].id}: ${title.substring(0, 50)} (Canprod: ${product.rows[0].canprod_id || 'NULL'})`);
        const latestPrice = await pool.query(
          `SELECT price 
            FROM price 
            WHERE product_id = $1 
              AND website = $2 
            ORDER BY date DESC, id DESC 
            LIMIT 1`,
          [product?.rows[0]?.id, "aelia_auckland"]
        );

        // Insert new price only if it has changed
        if (
          latestPrice.rowCount === 0 ||
          latestPrice.rows[0].price != price[0].price.toFixed(3)
        ) {
          new_prices += 1;
          await pool.query(
            `INSERT INTO price (product_id, date, price, website, price_per_unit)
                        VALUES ($1, current_date, $2, $3, $4)`,
            [
              product?.rows[0]?.id,
              price[0].price,
              "aelia_auckland",
              price_per_unit,
            ]
          );
        }

        await pool.query(
          `UPDATE product 
           SET last_checked = current_timestamp, country = $1, url = $2, image_url = $3, sub_category = $4
           WHERE id = $5`,
          ["new zealand", url, img, sub_category, product?.rows[0]?.id]
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
      logError(err);
    }

    iterator += 1;
  }
};

module.exports = updateDBEntry;
