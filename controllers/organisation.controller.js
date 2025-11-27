const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOrganisationsList = catchAsync(async (req,res,next)=>{
    const organisations = await pool.query(`SELECT * from organisation ORDER BY id ASC;`);

    return res.status(200).json({
        status:"success",
        message:"Organisations fetched successfully",
        data: organisations.rows
    });
})