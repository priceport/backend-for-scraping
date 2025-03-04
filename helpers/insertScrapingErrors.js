const pool = require('../configs/postgresql.config'); 

const insertScrapingError = async (log, type, createdAt = new Date()) => {
    const query = `
        INSERT INTO scraping_error (log, type, created_at)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [log, type, createdAt]);
        return result.rows[0]; // Returning the inserted row
    } catch (error) {
        console.error('Error inserting scraping error:', error);
        throw error;
    }
};

module.exports = { insertScrapingError };
