const pool = require("../../../configs/postgresql.config");
const calculatePricePerUnit = require("../../calculatePricePerUnit");
const logError = require("../../logError");

const updateDBEntry = async (data) => {
    let iterator = 0;
    let db_ops = 0;
    let new_prices = 0;

    while (iterator < data?.length) {
        try {
            let { url, category, title, brand, source, last_check, price, unit, quantity, sub_category, img, promo, promo2 } = data[iterator];
            let price_per_unit = calculatePricePerUnit(price[0].price, quantity, unit);

            let product = await pool.query(
                "SELECT * FROM product WHERE url = $1 AND website = $2",
                [url, "lotte_brisbane"]
            );

            if (product.rowCount === 0) {
                // If no product exists, create one
                product = await pool.query(
                    `INSERT INTO product (title, brand, description, url, image_url, qty, unit, category, website, tag)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                    [title, brand, "No desc", url, img, quantity, unit, category, "lotte_brisbane", "duty-free"]
                );
            } else {
                // Update last_checked timestamp
                await pool.query(
                    `UPDATE product 
                    SET last_checked = current_timestamp 
                    WHERE id = $1`,
                    [product?.rows[0]?.id]
                );
            }

            // Check the most recent price for this product and website
            const latestPrice = await pool.query(
                `SELECT price 
                FROM price 
                WHERE product_id = $1 AND website = $2 
                ORDER BY date DESC 
                LIMIT 1`,
                [product?.rows[0]?.id, "lotte_brisbane"]
            );

            // Insert new price only if it has changed
            console.log(latestPrice.rows[0].price,price[0].price.toFixed(2));
            if (latestPrice.rowCount === 0 || latestPrice.rows[0].price != price[0].price.toFixed(2)) {
                await pool.query(
                    `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
                    [product?.rows[0]?.id, price[0].price, "lotte_brisbane", price_per_unit]
                );
                new_prices += 1;
            }

            // Promo insertion logic
            if (promo) {
                for (let i = 0; i < promo?.length; i++) {
                    await pool.query(
                        `INSERT INTO promotion (product_id, text, price, date, website) 
                        VALUES ($1, $2, $3, current_date, $4)`,
                        [product?.rows[0]?.id, promo[i]?.text, promo[i]?.price, "lotte_brisbane"]
                    );
                }
            }

            if (promo2) {
                await pool.query(
                    `INSERT INTO promotion (product_id, text, price, date, website) 
                    VALUES ($1, $2, $3, current_date, $4)`,
                    [product?.rows[0]?.id, promo2?.text, promo2?.price, "lotte_brisbane"]
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
