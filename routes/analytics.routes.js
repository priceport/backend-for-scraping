const router = require('express').Router();
const UserController = require('../controllers/user.controller.js');
const AnalyticsController = require('../controllers/analytics.controller.js');

router.route("/trend/competetion")
.get(UserController.isLoggedIn,AnalyticsController.getCompetetionTrendsData);

router.route("/trend/time")
.get(UserController.isLoggedIn,AnalyticsController.getTimeTrends);

router.route("/ppc")
.get(UserController.isLoggedIn,AnalyticsController.pricePerCategory);

router.route("/ppb")
.get(UserController.isLoggedIn,AnalyticsController.pricePerBrand);

module.exports = router;