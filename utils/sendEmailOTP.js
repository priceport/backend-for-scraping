const sendEmailWithEJSTemplate = require("./sendEmail.js");

module.exports = async (user)=>{
    try{

        //generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const emailData = {
            firstName:user?.first_name,
            otp
        }
        
        //send email logic here 
        await sendEmailWithEJSTemplate(
            user?.email,
            'OTP',
            `/../views/email-otp.ejs`,
            emailData
        );

        return otp;
    }catch(err){
        return false;
    }
}