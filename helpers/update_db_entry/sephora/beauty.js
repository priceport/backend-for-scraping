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

      // Validate price data
      if (!price || !Array.isArray(price) || price.length === 0 || !price[0] || price[0].price === undefined || price[0].price === null) {
        console.log(`Skipping item with invalid price data: ${title || url}`);
        iterator += 1;
        continue;
      }

      const currentPrice = price[0].price;

      // Skip if price is invalid (e.g., "Invalid input" string)
      if (currentPrice === "Invalid input" || isNaN(currentPrice)) {
        console.log(`Skipping item with invalid price value: ${title || url}, price: ${currentPrice}`);
        iterator += 1;
        continue;
      }

      let price_per_unit = calculatePricePerUnit(
        currentPrice,
        quantity,
        unit
      );

      let product = await pool.query(
        "SELECT * FROM product WHERE url = $1 AND website = $2",
        [url, "sephora"]
      );

      if (product.rowCount === 0) {
        // If no product exists, create one
        product = await pool.query(
          `INSERT INTO product (title, brand, description, url, image_url, qty, unit, category, sub_category, website, tag, country)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
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
            "sephora",
            "domestic",
            "new zealand",
          ]
        );
      } else {
        // Update last_checked timestamp
        await pool.query(
          `UPDATE product 
                    SET last_checked = current_timestamp , country = $2
                    WHERE id = $1`,
          [product?.rows[0]?.id, "new zealand"]
        );
      }

      // Check the most recent price for this product and website
      const latestPrice = await pool.query(
        `SELECT price 
                FROM price 
                WHERE product_id = $1 AND website = $2 
                ORDER BY date DESC, id DESC 
                LIMIT 1`,
        [product?.rows[0]?.id, "sephora"]
      );

      // Insert new price only if it has changed
      const existingPrice = latestPrice.rowCount > 0 && latestPrice.rows[0] ? latestPrice.rows[0].price : null;
      const newPriceString = currentPrice.toFixed(3);
      
      if (existingPrice !== null) {
        console.log(`${existingPrice} ${newPriceString}`);
      } else {
        console.log(`New price: ${newPriceString}`);
      }

      if (
        latestPrice.rowCount === 0 ||
        existingPrice !== newPriceString
      ) {
        await pool.query(
          `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
          [product?.rows[0]?.id, currentPrice, "sephora", price_per_unit]
        );
        new_prices += 1;
      }

      // Promo insertion logic (if applicable in the future)
      if (promo) {
        for (let i = 0; i < promo.length; i++) {
          await pool.query(
            `INSERT INTO promotion (product_id, text, price, date, website) 
                        VALUES ($1, $2, $3, current_date, $4)`,
            [product?.rows[0]?.id, promo[i]?.text, promo[i]?.price, "sephora"]
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
};

module.exports = updateDBEntry;
