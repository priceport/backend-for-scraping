const pool = require("../configs/postgresql.config");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const isBodyComplete = require("../utils/isBodyComplete");

const createLead = catchAsync(async (req, res, next) => {
    try {
        const { first_name, last_name, email, query } = req.body;

        const isComplete = isBodyComplete(req, ["first_name", "last_name", "email","query"]);
        if (!isComplete[0]) {
            return next(
                new AppError(`${isComplete[1]} missing from request body!`, 400)
            );
        }

        
        // Insert lead into database
        const result = await pool.query(
            `INSERT INTO lead (first_name, last_name, email, query) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [first_name, last_name, email, query]
        );

        res.status(201).json({ message: "Lead created successfully", lead: result.rows[0] });
    } catch (error) {
        console.error("Error creating lead:", error);

        if (error.code === '23505') { // Unique constraint violation (email already exists)
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

module.exports = { createLead };
