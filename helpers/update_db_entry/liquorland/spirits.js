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
      let price_per_unit = calculatePricePerUnit(
        price[0].price,
        quantity,
        unit
      );

      let product = await pool.query(
        "SELECT * FROM product WHERE url = $1 AND website = $2",
        [url, "liquorland"]
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
            "liquorland",
            "domestic",
            "new zealand",
          ]
        );
        await pool.query(
          `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
          [product?.rows[0]?.id, price[0].price, "liquorland", price_per_unit]
        );
        new_prices += 1;
      } else {
        // Check the most recent price for this product and website
        const latestPrice = await pool.query(
          `SELECT price 
                    FROM price 
                    WHERE product_id = $1 AND website = $2 
                    ORDER BY date DESC, id DESC 
                    LIMIT 1`,
          [product?.rows[0]?.id, "liquorland"]
        );

        const existingPrice = latestPrice.rows[0]?.price || 'No existing price';
        const newPrice = price[0].price.toFixed(3);
        console.log(`Price comparison: ${existingPrice} vs ${newPrice}`);
        
        if (
          latestPrice.rowCount === 0 ||
          latestPrice.rows[0].price != newPrice
        ) {
          await pool.query(
            `INSERT INTO price (product_id, date, price, website, price_per_unit)
                        VALUES ($1, current_date, $2, $3, $4)`,
            [product?.rows[0]?.id, price[0].price, "liquorland", price_per_unit]
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

