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
            let { url, category, title, brand, source, last_check, price, unit, quantity, sub_category, img, promo } = data[iterator];
            let price_per_unit = calculatePricePerUnit(price[0].price, quantity, unit);

            let product = await pool.query(
                "SELECT * FROM product WHERE url = $1 AND website = $2",
                [url, "heinemann_sydney"]
            );

            if (product.rowCount === 0) {
                // If no product exists, create one
                // console.log("new");
                product = await pool.query(
                    `INSERT INTO product (title, brand, description, url, image_url, qty, unit, category, sub_category, website, tag)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                    [title?.slice(0, 299), brand, "No desc", url, img, quantity, unit, category, sub_category, "heinemann_sydney", "duty-free"]
                );
            } else {
                // console.log("old");
                // If product exists, update last check
                await pool.query(
                    `UPDATE product 
                    SET last_checked = current_timestamp 
                    WHERE id = $1`,
                    [product?.rows[0]?.id]
                );
            }

            // console.log("price");
            // Check the most recent price for this product and website
            const latestPrice = await pool.query(
                `SELECT price 
                FROM price 
                WHERE product_id = $1 AND website = $2 
                ORDER BY date DESC 
                LIMIT 1`,
                [product?.rows[0]?.id, "heinemann_sydney"]
            );

            // Insert new price only if it has changed
            // console.log(latestPrice.rows[0].price,price[0].price.toFixed(3));
            if (latestPrice.rowCount === 0 || latestPrice.rows[0].price != price[0].price.toFixed(3)) {
                await pool.query(
                    `INSERT INTO price (product_id, date, price, website, price_per_unit)
                    VALUES ($1, current_date, $2, $3, $4)`,
                    [product?.rows[0]?.id, price[0].price, "heinemann_sydney", price_per_unit]
                );
                new_prices += 1;
            }

            // Promo insertion logic
            for (let i = 0; i < promo?.length; i++) {
                await pool.query(
                    `INSERT INTO promotion (product_id, text, price, website) 
                    VALUES ($1, $2, $3, $4)`,
                    [product?.rows[0]?.id, promo[i]?.text, promo[i]?.price, "heinemann_sydney"]
                );
                // if (promo[i]?.includes("FOR")) {
                //     let p = promo[i]?.split("FOR");
                //     p = parseFloat(p[1]?.replace("$", "")) / parseFloat(p[0]);

                //     if (isNaN(p)) continue;

                //     console.log("promo");
                //     // await pool.query(
                //     //     `INSERT INTO promotion (product_id, text, price, website, tag) 
                //     //     VALUES ($1, $2, $3, $4, $5)`,
                //     //     [product?.rows[0]?.id, promo[i], p, "heinemann_sydney", "duty-free"]
                //     // );
                // } else if (promo[i]?.includes("SAVE")) {
                //     let p = price[0]?.price * ((100 - parseFloat(promo[i].split(" ")[4]?.replace("%", ""))) / 100);

                //     if (isNaN(p)) continue;

                //     console.log("promo");
                //     // await pool.query(
                //     //     `INSERT INTO promotion (product_id, text, price, website) 
                //     //     VALUES ($1, $2, $3, $4)`,
                //     //     [product?.rows[0]?.id, promo[i], p, "heinemann_sydney"]
                //     // );
                // }
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
