const { promisify } = require("util");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const isBodyComplete = require("../utils/isBodyComplete.js");
// const User = require("./../models/user.model.js");
const pool = require("../configs/postgresql.config");
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const sendEmailOTP = require("../utils/sendEmailOTP.js");
// const sendEmailWithEJSTemplate = require("../helpers/sendMail.js");

const sendJWT = (user,res) =>{
    const token = jwt.sign({_id:user.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY * 60 * 60 * 24
    });

    res.cookie('jwt',token,{
        httpOnly:true,
        expires:new Date(Date.now() +process.env.JWT_EXPIRY * 60 * 60 * 24 * 1000)
    });

    user.password=undefined;

    return res.status(200).json({
        status:'success',
        message:'Login succesfull',
        data:user,
        jwt:token
    });
}

exports.register = catchAsync(async (req,res,next)=>{
    //Check if body is complete
    const isComplete = isBodyComplete(req,["first_name","last_name","user_name","organisation_id","email","password","passwordConfirm","role"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    if(req.body.role =="admin") req.body.role = "employee";
    
    //Check if password matches password confirm
    if(req.body.password!==req.body.passwordConfirm){
        return next(
            new AppError(`Password should match PasswordConfirm!`,400)
        );
    }


    //Create a new user
    const query = `
        INSERT INTO users (first_name, last_name, user_name, email, password, role, organisation_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.user_name,
        req.body.email,
        hashedPassword,
        req.body.role,
        req.body.organisation_id
    ];

    const newUser = await pool.query(query,values);

    newUser.rows[0].password = undefined;

    return res.status(201).json({
        status:'success',
        message:'User created succesfully',
        data:newUser.rows[0]
    })

});
exports.login = catchAsync(async (req,res,next)=>{
    //Check if body is complete
    const isComplete = isBodyComplete(req,["user_name","password"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

     // Step 1: Check if user exists with given email
     const user_name = req.body.user_name;
     const password = req.body.password;
 
     const userQuery = 'SELECT * FROM users WHERE user_name = $1';
     const userResult = await pool.query(userQuery, [user_name]);
 
     if (userResult.rowCount === 0) {
       return next(new AppError('Email Id or Password Incorrect!', 400));
     }
 
     const user = userResult.rows[0];
 
     // Step 2: Check if password matches with user
     const passwordMatch = await bcrypt.compare(password, user.password);
 
     if (!passwordMatch) {
       return next(new AppError('Email Id or Password Incorrect!', 400));
     }

    // const emailData = {
    //     name:`${user?.firstName} ${user?.lastName}`,
    //     email:`${user?.email}`
    // }

    // sendEmailWithEJSTemplate(
    //     process.env.ADMIN_EMAIL,
    //     'Login alert',
    //     `/../views/loginTemplate.ejs`,
    //     emailData
    // );

    // sendEmailWithEJSTemplate(
    //     process.env.ADMIN_EMAIL_2,
    //     'Login alert',
    //     `/../views/loginTemplate.ejs`,
    //     emailData
    // );

    //Create and send JWT
    sendJWT(user,res);
});

//check if jwt is present and valid
exports.isLoggedIn = catchAsync(async (req,res,next)=>{
    const token = req.cookies.jwt || req.headers.jwt || req.query.jwt;
    if(!token){
        return next(
            new AppError('Please login!',401)
        );
    }

    const data = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    let user = await pool.query(userQuery, [data._id]);

    if(!user.rowCount === 0){
        return next(
            new AppError('JWT invalid!',401)
        );
    }

    user = user.rows[0];
    user.password = undefined;
    req.user = user;

    next();
});

exports.sendEmailOtp = catchAsync(async (req,res,next)=>{
    let user = req?.body?.user_name;

    if(!user){
        return next(
            new AppError('user_name missing from request body',500)
        );
    }

    user = await pool.query('SELECT * FROM users WHERE user_name=$1',[user]);

    if (user.rowCount === 0) {
        return next(new AppError('user_name incorrect!', 400));
    }

    user = user?.rows[0];

    //block request if more than 4 otps are sent in last 24 hours
    if(user?.email_otp_count>=4&&((((new Date()) - user?.email_otp_at)/(1000 * 60 * 60))<24)){
        return next(
            new AppError('OTP limit exceeded, try again after 24 hours!',500)
        );
    }

    //send otp
    let otpResEmail = await sendEmailOTP(user);

    //if some error throw 500
    if(!otpResEmail){
        return next(
            new AppError('Unable to send otp on email, try again!',500)
        );
    }

    //if last otp was sent more than 24 hours ago reset count else inc by 1
    if(!user.email_otp_count||((((new Date()) - user?.email_otp_at)/(1000 * 60 * 60))>24)) user.email_otp_count = 1;
    else user.email_otp_count+=1;

    //store otp and time
    user.email_otp=otpResEmail;
    user.email_otp_at = new Date(Date.now());

    const updateQuery = `
      UPDATE users
      SET email_otp_count = $1,
          email_otp = $2,
          email_otp_at = $3
      WHERE id = $4
    `;

    const result = await pool.query(updateQuery, [user?.email_otp_count,user?.email_otp,user?.email_otp_at,user?.id]);

    if (result.rowCount === 0) {
      throw new Error('User not found');
    }

    //return response
    return res?.status(200).json({
        status:"success",
        message:"OTP sent succesfully!"
    })
});

exports.verifyEmailNumber = catchAsync(async (req,res,next)=>{
    const isComplete = isBodyComplete(req,["otp","user_name"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    let user = req?.body?.user_name;

    if(!user){
        return next(
            new AppError('user_name missing from request body',500)
        );
    }

    user = await pool.query('SELECT * FROM users WHERE user_name=$1',[user]);

    if (user.rowCount === 0) {
        return next(new AppError('user_name incorrect!', 400));
    }

    user = user?.rows[0];

    //throw error if otp is older than 10mins
    if((((new Date()) - user?.email_otp_at)/(1000 * 60))>10){
        return next(
            new AppError(`OTP expired, try again!`,400)
        );
    }

    //throw error if otp dosent match
    if(user?.email_otp!=req?.body?.otp){
        return next(
            new AppError(`Invalid OTP!`,400)
        );
    }


    const secret = Math.floor(100000 + Math.random() * 900000).toString();

    const updateQuery = `
      UPDATE users
      SET email_otp_count = $1,
          email_otp = $2,
          email_otp_at = $3,
          allow_pass_change = true,
          allow_pass_change_secret = $4
      WHERE id = $5
    `;

    await pool.query(updateQuery, [0, null, null,secret,user?.id]);

    return res?.status(200).json({
        status:"success",
        message:"OTP verified succesfully",
        data:{
            secret
        }
    })
});

exports.changePassword = catchAsync(async (req,res,next)=>{
    //Check if body is complete
    const isComplete = isBodyComplete(req,["password","confirmPassword","secret","user_name"]);
    if(!isComplete[0]){
        return next(
            new AppError(`${isComplete[1]} missing from request body!`,400)
        );
    }

    let user = req?.body?.user_name;

    if(!user){
        return next(
            new AppError('user_name missing from request body',500)
        );
    }

    user = await pool.query('SELECT * FROM users WHERE user_name=$1',[user]);

    if (user.rowCount === 0) {
        return next(new AppError('user_name incorrect!', 400));
    }

    user = user?.rows[0];

    if(req?.body?.password!=req?.body?.confirmPassword){
        return next(
            new AppError(`Password and confirmPassword should match!`,400)
        );
    }

    if(user?.allow_pass_change_secret!=req?.body?.secret){
        return next(
            new AppError(`Invalid secret value!`,400)
        );
    }

    const hashedPassword = await bcrypt.hash(req?.body?.password, 12);

    const updateQuery = `
      UPDATE users
      SET password = $1,
      email_otp_count = 0,
      email_otp = null,
      email_otp_at = null,
      allow_pass_change = false,
      allow_pass_change_secret = null
      WHERE user_name = $2
      RETURNING id, user_name;
    `;

    await pool.query(updateQuery, [hashedPassword, req?.body?.user_name]);

    return res?.status(200)?.json({
        status:"success",
        message:"Password changed succesfully!"
    })
})

exports.isAuthorized = (role)=>{
    return catchAsync(async (req,res,next)=>{
        if(req.user.role!==role){
            return next(
                new AppError('Your not authorized for action',401)
            );
        }

        next();
    });
}

exports.getUserProfile = catchAsync(async (req,res,next)=>{
    return res.status(200).json({
        status:"success",
        message:"User profile fetched succesfully!",
        data:req.user
    })
})