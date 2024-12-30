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

module.exports = router;