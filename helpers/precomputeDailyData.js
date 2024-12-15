const pool = require('../configs/postgresql.config'); // Import your database configuration
const redisClient = require('../configs/redis.config'); // Import Redis configuration

const precomputeDailyData = async (source) => {
    try {
        // Query to fetch all product data without filters
        const data = await pool.query(`
        WITH latest_promotions AS (
            SELECT
                promo.product_id,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'date', promo.date,
                        'text', promo.text,
                        'price', promo.price
                    )
                ) AS promotions
            FROM promotion promo
            WHERE promo.date = (
                SELECT MAX(promo_inner.date)
                FROM promotion promo_inner
                WHERE promo_inner.product_id = promo.product_id
            )
            GROUP BY promo.product_id
        ),
        latest_batch AS (
            SELECT
                pr.canprod_id,
                MAX(pr.date) AS latest_date
            FROM product_price_rank pr
            GROUP BY pr.canprod_id
        ),
        filtered_rank AS (
            SELECT
                pr.*
            FROM product_price_rank pr
            JOIN latest_batch lb ON pr.canprod_id = lb.canprod_id AND pr.date = lb.latest_date
        ),
        source_products AS (
            SELECT
                p.canprod_id,
                pr.product_id,
                pr.website,
                pr.price_rank,
                p.brand,
                p.category,
                pr.date
            FROM product p
            JOIN filtered_rank pr ON p.id = pr.product_id
            WHERE pr.website = $1 -- Source website
        )
        SELECT 
            cp.id AS canprod_id,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'qty', p.qty,
                    'url', p.url,
                    'unit', p.unit,
                    'brand', p.brand,
                    'title', p.title,
                    'website', pr.website,
                    'category', p.category,
                    'image_url', p.image_url,
                    'pricerank', CONCAT(pr.price_rank, '/', pr.total_peers),
                    'product_id', p.id,
                    'description', COALESCE(p.description, 'No desc'),
                    'latest_price', pr.price,
                    'sub_category', p.sub_category,
                    'latest_promotions', COALESCE(lp.promotions, '[]'::JSON)
                )
            ) AS products_data,
            MAX(CASE WHEN pr.website = $1 THEN pr.price_rank END) AS source_pricerank,
            MAX(CASE WHEN pr.website = $1 THEN pr.price END) AS source_price
        FROM 
            cannonical_product cp
        JOIN 
            product p ON cp.id = p.canprod_id
        JOIN 
            filtered_rank pr ON p.id = pr.product_id
        LEFT JOIN 
            latest_promotions lp ON lp.product_id = p.id
        JOIN 
            source_products sp ON sp.canprod_id = p.canprod_id 
                              AND sp.date = pr.date -- Ensure peers belong to the same batch as the source
        WHERE 
            p.canprod_id IS NOT NULL
        GROUP BY 
            cp.id;  
        `,[source]);

        // Store the result in Redis
        await redisClient.set(
            'daily_product_data', // Key to store data
            JSON.stringify(data.rows), // Serialize data to JSON
            'EX', 86400 // Set expiry to 24 hours (in seconds)
        );

        console.log('Daily product data successfully precomputed and cached!');
    } catch (error) {
        console.error('Error during precomputing daily product data:', error.message);
    }
};

module.exports = precomputeDailyData;
