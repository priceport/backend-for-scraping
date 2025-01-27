const express = require("express");
const OrganisationController = require('../controllers/organisation.controller.js');
const UserController = require('../controllers/user.controller.js');

const router = express.Router();

router.route("/")
.get(UserController?.isLoggedIn,OrganisationController?.getAllOrganisations);

module.exports = router;