const express = require("express");
const LeadsController = require('../controllers/leads.controller.js');
const UserController = require('../controllers/user.controller.js');

const router = express.Router();

router.route("/")
.post(LeadsController?.createLead);

module.exports = router;