const router = require('express').Router();
const MappingController = require('../controllers/mapping.controller.js');
const UserController = require('../controllers/user.controller.js');

router.route("/")
.get(UserController.isLoggedIn,MappingController.getAllUnmappedProductsFromSource)
.post(UserController.isLoggedIn,MappingController.createMapping);

router.route("/unseen")
.patch(UserController.isLoggedIn,MappingController.makeProductUnseen);

router.route("/add-product")
.patch(UserController.isLoggedIn,MappingController.addProductToMapping);

router.route("/similarity")
.get(UserController.isLoggedIn,MappingController.getSimilarityByTitleFromSource);

module.exports = router;