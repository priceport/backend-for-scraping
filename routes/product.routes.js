const express = require("express");
const ProductController = require('../controllers/product.controller.js');
const UserController = require('../controllers/user.controller.js');
const cacheMiddleware = require("../helpers/cacheMiddleware.js");

const router = express.Router();

router.route("/")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getAllProductsFor);

router.route("/sub_category")
.get(UserController.isLoggedIn,ProductController.getAllSubcategoryBySource);

router.route("/uncached")
.get(UserController.isLoggedIn,UserController.isAuthorized("admin"),(req,res,next)=>{
    req.system = 'admin';
    next();
},ProductController.getAllProductsFor);

router.route("/:id")
.put(UserController.isLoggedIn,UserController.isAuthorized("admin"),ProductController.editProduct);

router.route("/complaince/:id")
.put(UserController.isLoggedIn,UserController.isAuthorized("admin"),ProductController.changeProductComplainceStatus);

router.route("/mapping/:id")
.delete(UserController.isLoggedIn,UserController.isAuthorized("admin"),ProductController.removeMapping);

router.route("/marginally-behind")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getMarginallyBehindProducts);

router.route("/least-competitive")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getLeastCompetitiveProducts);

router.route("/dashboard")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getDashboardStatsFor);

router.route("/brand")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getBrandStatsFor);

router.route("/category")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getCategoryStatsFor);

router.route("/pricerank")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getPriceRankFor);

router.route("/brand/all")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getAllBrands);

router.route("/location/all")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getAllLocations);

router.route("/date-range")
.get(UserController.isLoggedIn,cacheMiddleware,ProductController.getDateRange);

router.route("/price-history/:canprod_id")
.get(UserController.isLoggedIn,ProductController.getPriceHistory);

router.route("/download/no-unit-or-qty")
.get(UserController.isLoggedIn,ProductController.downloadQtyAndUnitLessProducts)

module.exports = router;