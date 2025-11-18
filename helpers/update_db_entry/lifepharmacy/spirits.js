const pool = require("../../../configs/postgresql.config");
const calculatePricePerUnit = require("../../calculatePricePerUnit");
const logError = require("../../logError");

// Main function
const updateDBEntry = async (data) => {
  let iterator = 0;
  let db_ops = 0;
  let new_prices = 0;
  let product_created = 0;
  let product_updated = 0;

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

      let normalizedPrice = null;
      if (typeof price === "number") {
        normalizedPrice = price;
      } else if (Array.isArray(price) && price[0]?.price !== undefined) {
        normalizedPrice = price[0].price;
      } else if (price && typeof price === "object" && price.price !== undefined) {
        normalizedPrice = price.price;
      }

      if (normalizedPrice === null || normalizedPrice === undefined) {
        iterator += 1;
        continue;
      }

      let price_per_unit = calculatePricePerUnit(
        normalizedPrice,
        quantity,
        unit
      );

      let product = await pool.query(
        "SELECT * FROM product WHERE url = $1 AND website = $2",
        [url, "lifepharmacy"]
      );

      if (product.rowCount === 0) {
        // If no product exists, create one
        product = await pool.query(
          `INSERT INTO product (title, brand, description, url, image_url, qty, unit, category, sub_category, website, tag, country)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12) RETURNING *`,
          [
            title,
            null,
            "No desc",
            url,
            img,
            quantity,
            unit,
            category,
            sub_category,
            "lifepharmacy",
            "duty_free",
            "new zealand",
          ]
        );
        await pool.query(
          `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
          [product?.rows[0]?.id, normalizedPrice, "lifepharmacy", price_per_unit]
        );
        new_prices += 1;
        product_created += 1;
      } else {
        // Check the most recent price for this product and website
        const latestPrice = await pool.query(
          `SELECT price 
                    FROM price 
                    WHERE product_id = $1 AND website = $2 
                    ORDER BY date DESC, id DESC 
                    LIMIT 1`,
          [product?.rows[0]?.id, "lifepharmacy"]
        );

        const existingPrice = latestPrice.rows[0]?.price || 'No existing price';
        const newPrice = normalizedPrice.toFixed(3);
        // console.log(`Price comparison: ${existingPrice} vs ${newPrice}`);
        
        if (
          latestPrice.rowCount === 0 ||
          latestPrice.rows[0].price != newPrice
        ) {
          await pool.query(
            `INSERT INTO price (product_id, date, price, website, price_per_unit)
                        VALUES ($1, current_date, $2, $3, $4)`,
            [product?.rows[0]?.id, normalizedPrice, "lifepharmacy", price_per_unit]
          );
          new_prices += 1;
        }

        // Update last_checked timestamp
        await pool.query(
          `UPDATE product 
                    SET last_checked = current_timestamp , country = $2
                    WHERE id = $1`,
          [product?.rows[0]?.id, "new zealand"]
        );
        product_updated += 1;
      }

      // Promo insertion logic
      if (promo && Array.isArray(promo) && promo.length > 0) {
        // Delete existing promos for this product and website to avoid duplicates
       

        for (let i = 0; i < promo.length; i++) {
          // Skip promos with invalid price values (but allow null)
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
              "lifepharmacy",
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

  console.log("total ops:" + db_ops);
  console.log("new prices:" + new_prices);
  console.log("product created:" + product_created);
  console.log("product updated:" + product_updated);
};

module.exports = updateDBEntry;

