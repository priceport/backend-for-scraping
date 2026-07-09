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
        local_price,
      } = data[iterator];
      let price_per_unit = calculatePricePerUnit(
        price[0].price,
        quantity,
        unit
      );

      let product = await pool.query(
        "SELECT * FROM product WHERE url = $1 AND website = $2",
        [url, "liquorland_aus"]
      );

      if (product.rowCount === 0) {
        // If no product exists, create one
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
            "liquorland_aus",
            "domestic",
            "australia",
          ]
        );
        product_created += 1;
      } else {
        await pool.query(
          `UPDATE product SET last_checked = current_timestamp, country = $2, brand = $3 WHERE id = $1`,
          [product?.rows[0]?.id, "australia", brand]
        );
        product_updated += 1;
      }

      const inserted = await syncPriceEntry({
        pool,
        productId: product.rows[0].id,
        website: "liquorland_aus",
        usdPrice: price[0].price,
        localPrice: local_price,
        pricePerUnit: price_per_unit,
        currency: "AUD",
      });
      if (inserted) new_prices += 1;

      // Promo insertion logic
      if (promo && Array.isArray(promo) && promo.length > 0) {
        // Delete existing promos for this product and website to avoid duplicates
        await pool.query(
          `DELETE FROM promotion WHERE product_id = $1 AND website = $2`,
          [product?.rows[0]?.id, "liquorland_aus"]
        );

        for (let i = 0; i < promo.length; i++) {
          // Skip promos with invalid price values
          if (promo[i]?.price === "Invalid input" || promo[i]?.price === null || promo[i]?.price === undefined) {
            continue;
          }
          
          await insertPromotion({
            pool,
            productId: product?.rows[0]?.id,
            website: "liquorland_aus",
            text: promo[i]?.text || "",
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
  console.log("product created:" + product_created);
  console.log("product updated:" + product_updated);
};

module.exports = updateDBEntry;
