const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
    user: 'postgres',         // Replace with your PostgreSQL username
    host: 'localhost',             // Replace with your PostgreSQL host (usually localhost)
    database: 'Priceport',// Replace with your database name
    password: '8080483061',     // Replace with your PostgreSQL password
    port: 5432,                    // Default PostgreSQL port
});
      
module.exports = pool;
