const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");
const isBodyComplete = require("../utils/isBodyComplete");
const AppError = require("../utils/appError");

exports.createReport = catchAsync(async (req,res,next)=>{

    const isComplete = isBodyComplete(req, ["name", "category", "subcategory", "brand", "location"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const data = await pool.query(`INSERT INTO reports (user_id, name, categories, subcategories, brands, locations)
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
    ) RETURNING *;
    `,[req?.user?.id,req?.body?.name,req?.body?.category,req?.body?.subcategory,req?.body?.brand,req?.body?.location]);

    return res.status(200).json({
        status:"success",
        message:"Report created succesfully",
        data:data?.rows
    })
})

exports.getAllReports = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`SELECT * FROM reports WHERE user_id = $1`,[req?.user?.id]);

    return res.status(200).json({
        status:"success",
        message:"Reports fetched succesfully",
        data:data?.rows
    })
})

exports.editReport = catchAsync(async (req,res,next)=>{
    const id = req?.params?.reportId;

    const isComplete = isBodyComplete(req, ["name", "category", "subcategory", "brand", "location"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const data = await pool.query(`UPDATE reports
    SET 
        name = $2,
        categories = $3, -- Updated categories
        subcategories = $4, -- Updated subcategories
        brands = $5,                  -- Updated brands
        locations = $6             -- Updated locations
    WHERE 
        id = $7                                     -- Report ID to update
        AND user_id = $1
    RETURNING *;                           -- Ensure it belongs to the current user
    `,[req?.user?.id, req?.body?.name,req?.body?.category,req?.body?.subcategory,req?.body?.brand,req?.body?.location,id]);

    return res.status(200).json({
        status:"success",
        message:"Report edited succesfully",
        data:data?.rows
    })

})

exports.deleteReport = catchAsync(async (req,res,next)=>{
    const id = req?.params?.reportId;

    await pool.query(`
       DELETE FROM reports WHERE id = $1 AND user_id = $2;
    `,[id,req?.user?.id]);

    return res.status(204).json({
        status:"success",
        message:"Report deleted succesfully"
    })
})