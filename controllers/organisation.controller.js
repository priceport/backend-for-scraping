const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");

exports.getAllOrganisations = catchAsync(async (req,res,next)=>{
    const organisation = await pool.query(`SELECT * from organisation;`);
    return res.status(200).json({
        status:"success",
        message:"All users fetched succesfully",
        data: organisation.rows
    });
})