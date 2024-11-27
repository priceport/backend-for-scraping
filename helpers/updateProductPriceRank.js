const pool = require("../configs/postgresql.config");

// Function to update product_price_rank table
const updateProductPriceRank = async () => {
    try {
        console.log('Starting product price rank update...');
        
        // Define the query to update the product_price_rank table
        const query = `
        WITH latest_prices AS (
            SELECT DISTINCT ON (pr.product_id, pr.website)
                pr.product_id,
                pr.website,
                pr.date,
                pr.price
            FROM price pr
            JOIN product p ON p.id = pr.product_id
            WHERE p.canprod_id IS NOT NULL
            ORDER BY pr.product_id, pr.website, pr.date DESC -- Ensure the latest price comes first
        ),
        ranked_prices AS (
            SELECT
                p.id AS product_id,
                p.canprod_id,
                lp.website,
                lp.date,
                lp.price,
                CASE
                    WHEN p.qty IS NOT NULL AND p.unit IS NOT NULL THEN lp.price / p.qty
                    ELSE lp.price
                END AS price_per_unit,
                RANK() OVER (PARTITION BY p.canprod_id, lp.date ORDER BY CASE
                    WHEN p.qty IS NOT NULL AND p.unit IS NOT NULL THEN lp.price / p.qty
                    ELSE lp.price
                END ASC) AS price_rank
            FROM product p
            JOIN latest_prices lp ON p.id = lp.product_id
        )
        INSERT INTO product_price_rank
        SELECT
            product_id,
            canprod_id,
            date,
            price_rank,
            COUNT(*) OVER (PARTITION BY canprod_id, date) AS total_peers,
            website,
            price,
            price_per_unit
        FROM ranked_prices
        ON CONFLICT (product_id, website, date) DO UPDATE
        SET
            price_rank = EXCLUDED.price_rank,
            total_peers = EXCLUDED.total_peers,
            price = EXCLUDED.price,
            price_per_unit = EXCLUDED.price_per_unit;
        `;

        // Execute the query
        await pool.query(query);

        console.log('Product price rank update completed successfully.');
    } catch (error) {
        console.error('Error updating product price rank:', error.message);
    }
};

module.exports = updateProductPriceRank;
