const express = require("express");
const ProductController = require('../controllers/product.controller.js');
const UserController = require('../controllers/user.controller.js');
const cacheMiddleware = require("../helpers/cacheMiddleware.js");

const router = express.Router();

router.route("/")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getAllProductsFor);

router.route("/dashboard")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getDashboardStatsFor);

router.route("/brand")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getBrandStatsFor);

router.route("/category")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getCategoryStatsFor);

router.route("/pricerank")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getPriceRankFor);

module.exports = router;