const { Pool } = require('pg');
require("dotenv").config();

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,         // Replace with your PostgreSQL username
    host: process.env.DB_HOST,             // Replace with your PostgreSQL host (usually localhost)
    database: process.env.DB,// Replace with your database name
    password: process.env.DB_PASS,     // Replace with your PostgreSQL password
    port: process.env.DB_PORT,                    // Default PostgreSQL port
});
      
module.exports = pool;
