const express = require("express");
const ProductController = require('../controllers/product.controller.js');


const router = express.Router();

router.route("/")
.get(ProductController.getAllProductsFor);

router.route("/dashboard")
.get(ProductController.getDashboardStatsFor);

router.route("/brand")
.get(ProductController.getBrandStatsFor);

router.route("/category")
.get(ProductController.getCategoryStatsFor);

router.route("/pricerank")
.get(ProductController.getPriceRankFor);

module.exports = router;