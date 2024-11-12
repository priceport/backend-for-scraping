const express = require('express');
const UserController = require('../controllers/user.controller.js');

//router
const router = express.Router();

//user routes
router.route("/").get(UserController.isLoggedIn,UserController.getUserProfile);
router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/otp/email").get(UserController.sendEmailOtp);
router.route("/verify/email").post(UserController.verifyEmailNumber);
router.route("/password").patch(UserController.changePassword);

//exports
module.exports = router;