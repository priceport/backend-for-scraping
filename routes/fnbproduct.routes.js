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
.get(UserController.isLoggedIn,cacheMiddleware,FNBProductController.getAllFnbProductsFor);

router.route("/store")
.get(UserController.isLoggedIn,cacheMiddleware,FNBProductController.getAllStores);

router.route("/terminal")
.get(UserController.isLoggedIn,cacheMiddleware,FNBProductController.getAllTerminal);

router.route("/price-history/:canprod_id")
.get(UserController.isLoggedIn,FNBProductController.getPriceHistory);

module.exports = router;