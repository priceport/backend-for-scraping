const pool = require("../../../configs/postgresql.config");
const calculatePricePerUnit = require("../../calculatePricePerUnit");
const logError = require("../../logError");
const syncPriceEntry = require("../../currency_conversion/syncPriceEntry");
const insertPromotion = require("../../currency_conversion/insertPromotion");

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
        local_price,
      } = data[iterator];
      let price_per_unit = calculatePricePerUnit(
        price[0].price,
        quantity,
        unit
      );

      let product = await pool.query(
        "SELECT * FROM product WHERE url = $1 AND website = $2",
        [url, "au_sephora"]
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
            "au_sephora",
            "domestic",
            "Australia",
          ]
        );
      } else {
        // Update last_checked timestamp
        await pool.query(
          `UPDATE product 
                    SET last_checked = current_timestamp, country = $2
                    WHERE id = $1`,
          [product?.rows[0]?.id, "Australia"]
        );
      }

      const inserted = await syncPriceEntry({
        pool,
        productId: product.rows[0].id,
        website: "au_sephora",
        usdPrice: price[0].price,
        localPrice: local_price,
        pricePerUnit: price_per_unit,
        currency: "AUD",
      });
      if (inserted) new_prices += 1;


      // Promo insertion logic (if applicable in the future)
      if (promo) {
        for (let i = 0; i < promo.length; i++) {
          await insertPromotion({
            pool,
            productId: product?.rows[0]?.id,
            website: "au_sephora",
            text: promo[i]?.text,
            usdPrice: promo[i]?.price,
          });
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
