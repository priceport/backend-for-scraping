const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllOrganisations = catchAsync(async (req,res,next)=>{

    const orgId = req.params.orgId;

    if(!orgId){
        return next(new AppError("Organisation ID is required", 400));
    }

    const organisation = await pool.query(`SELECT * from organisation where id = $1;`,[orgId]);

    if(organisation.rows.length === 0){
        return next(new AppError("Organisation not found", 404));
    }

    if (organisation.rows[0].name !== "Priceport"){
        return next(new AppError("You are not authorized to access this resource", 403));
    }

    return res.status(200).json({
        status:"success",
        message:"User fetched succesfully",
        data: organisation.rows[0]
    });
})