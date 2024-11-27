const express = require("express");
const ReportController = require('../controllers/reports.controller.js');
const UserController = require('../controllers/user.controller.js');

const router = express.Router();

router.route("/")
.get(UserController?.isLoggedIn,ReportController?.getAllReports)
.post(UserController?.isLoggedIn,ReportController?.createReport);

router.route("/:reportId")
.delete(UserController?.isLoggedIn,ReportController?.deleteReport)
.put(UserController?.isLoggedIn,ReportController?.editReport);

module.exports = router;