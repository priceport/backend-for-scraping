const pool = require("../configs/postgresql.config");

async function updateDailyPriceStats(website) {
    const query = `
    WITH 
    normalized_products AS (
        SELECT 
            p.id AS product_id,
            p.title,
            p.canprod_id,
            pr.price AS flat_price,
            p.qty,
            p.unit,
            CASE 
                WHEN LOWER(p.unit) IN ('g', 'gm') THEN pr.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('ml') THEN pr.price / NULLIF(p.qty, 0)
                WHEN LOWER(p.unit) IN ('l') THEN pr.price / NULLIF(p.qty * 1000, 0)
                ELSE NULL
            END AS price_per_unit,
            p.website
        FROM 
            product p
        JOIN 
            price pr ON p.id = pr.product_id
        WHERE 
            p.website = $1
            AND p.canprod_id IS NOT NULL
    ),
    product_categories AS (
        SELECT 
            np.product_id,
            CASE
                -- Cheapest: No peers are cheaper
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM product p
                    JOIN price pr ON p.id = pr.product_id
                    WHERE p.canprod_id = np.canprod_id AND p.website != $1
                    AND COALESCE(
                        CASE 
                            WHEN LOWER(p.unit) IN ('g', 'gm') THEN pr.price / NULLIF(p.qty, 0)
                            WHEN LOWER(p.unit) IN ('ml') THEN pr.price / NULLIF(p.qty, 0)
                            WHEN LOWER(p.unit) IN ('l') THEN pr.price / NULLIF(p.qty * 1000, 0)
                            ELSE NULL
                        END, pr.price
                    ) < COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'cheapest'
                
                -- Expensive: No peers are more expensive
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM product p
                    JOIN price pr ON p.id = pr.product_id
                    WHERE p.canprod_id = np.canprod_id AND p.website != $1
                    AND COALESCE(
                        CASE 
                            WHEN LOWER(p.unit) IN ('g', 'gm') THEN pr.price / NULLIF(p.qty, 0)
                            WHEN LOWER(p.unit) IN ('ml') THEN pr.price / NULLIF(p.qty, 0)
                            WHEN LOWER(p.unit) IN ('l') THEN pr.price / NULLIF(p.qty * 1000, 0)
                            ELSE NULL
                        END, pr.price
                    ) > COALESCE(np.price_per_unit, np.flat_price)
                ) THEN 'expensive'
                
                -- Midrange: Default if neither cheapest nor expensive
                ELSE 'midrange'
            END AS price_category
        FROM 
            normalized_products np
    )
    INSERT INTO daily_price_stats (website, total_mapped_products, cheapest_count, expensive_count, midrange_count, date)
    SELECT 
        $1 AS website,
        COUNT(DISTINCT np.product_id) AS total_mapped_products,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'cheapest' THEN pc.product_id END) AS cheapest_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'expensive' THEN pc.product_id END) AS expensive_count,
        COUNT(DISTINCT CASE WHEN pc.price_category = 'midrange' THEN pc.product_id END) AS midrange_count,
        CURRENT_DATE AS date
    FROM 
        normalized_products np
    LEFT JOIN 
        product_categories pc ON np.product_id = pc.product_id;
    `;
  
    try {
      const data = await pool.query(query, [website]);
      console.log(`Daily price stats updated for website: ${website}`);
    } catch (error) {
      console.error(`Error updating daily price stats for website: ${website}`, error);
    }
  }

  module.exports = updateDailyPriceStats;