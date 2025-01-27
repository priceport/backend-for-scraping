const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");
const isBodyComplete = require("../utils/isBodyComplete");

exports.createReport = catchAsync(async (req,res,next)=>{

    const isComplete = isBodyComplete(req, ["name", "terminal", "store"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const data = await pool.query(`INSERT INTO reports_fnb (user_id, name, terminal, store)
    VALUES (
        $1,
        $2,
        $3,
        $4
    ) RETURNING *;
    `,[req?.user?.id,req?.body?.name,req?.body?.terminal,req?.body?.store]);

    return res.status(200).json({
        status:"success",
        message:"Report created succesfully",
        data:data?.rows
    })
})

exports.getAllReports = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`SELECT * FROM reports_fnb WHERE user_id = $1`,[req?.user?.id]);

    return res.status(200).json({
        status:"success",
        message:"Reports fetched succesfully",
        data:data?.rows
    })
})

exports.editReport = catchAsync(async (req,res,next)=>{
    const id = req?.params?.reportId;

    const isComplete = isBodyComplete(req, ["name", "terminal", "store"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const data = await pool.query(`UPDATE reports_fnb
    SET 
        name = $2,
        terminal = $3,
        store = $4
    WHERE 
        id = $5                                     -- Report ID to update
        AND user_id = $1
    RETURNING *;                           -- Ensure it belongs to the current user
    `,[req?.user?.id, req?.body?.name,req?.body?.terminal,req?.body?.store,id]);

    return res.status(200).json({
        status:"success",
        message:"Report edited succesfully",
        data:data?.rows
    })

})

exports.deleteReport = catchAsync(async (req,res,next)=>{
    const id = req?.params?.reportId;

    await pool.query(`
       DELETE FROM reports_fnb WHERE id = $1 AND user_id = $2;
    `,[id,req?.user?.id]);

    return res.status(204).json({
        status:"success",
        message:"Report deleted succesfully"
    })
})