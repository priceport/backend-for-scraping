const express = require("express");
const ProductController = require('../controllers/product.controller.js');
const UserController = require('../controllers/user.controller.js');

const router = express.Router();

router.route("/")
.get(UserController.isLoggedIn,ProductController.getAllProductsFor);

router.route("/dashboard")
.get(UserController.isLoggedIn,ProductController.getDashboardStatsFor);

router.route("/brand")
.get(UserController.isLoggedIn,ProductController.getBrandStatsFor);

router.route("/category")
.get(UserController.isLoggedIn,ProductController.getCategoryStatsFor);

router.route("/pricerank")
.get(UserController.isLoggedIn,ProductController.getPriceRankFor);

module.exports = router;