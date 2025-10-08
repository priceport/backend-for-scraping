const express = require("express");
const UserController = require('../controllers/user.controller.js');
const FNBProductController = require('../controllers/fnbproduct.controller.js');
const multer = require('multer');
const cacheMiddleware = require("../helpers/cacheMiddleware.js");

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.route("/upload")
.post(UserController.isLoggedIn, upload.single('fnbdata'),FNBProductController.addFnbProductsWithExcel);

router.route("/")
.get(UserController.isLoggedIn,FNBProductController.getAllFnbProductsFor);

router.route("/")
.post(UserController.isLoggedIn,FNBProductController.addProduct);

router.route("/uncached")
.get(UserController.isLoggedIn,UserController.isAuthorized("admin"),FNBProductController.getAllFnbProductsFor);

router.route("/store")
.get(UserController.isLoggedIn,cacheMiddleware,FNBProductController.getAllStores);

router.route("/terminal")
.get(UserController.isLoggedIn,cacheMiddleware,FNBProductController.getAllTerminal);

router.route("/price-history/:canprod_id")
.get(UserController.isLoggedIn,FNBProductController.getPriceHistory);

router.route("/price-change")
.get(UserController.isLoggedIn,FNBProductController.getPriceChanges);

router.route("/:id")
.put(UserController.isLoggedIn,UserController.isAuthorized("admin"),FNBProductController.editProduct);

router.route("/complaince/:id")
.put(UserController.isLoggedIn,UserController.isAuthorized("admin"),FNBProductController.changeProductComplainceStatus);

router.route("/mapping/:id")
.delete(UserController.isLoggedIn,UserController.isAuthorized("admin"),FNBProductController.removeMapping);

module.exports = router;