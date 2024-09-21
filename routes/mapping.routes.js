const router = require('express').Router();
const MappingController = require('../controllers/mapping.controller.js');

router.route("/")
.get(MappingController.getAllUnmappedProductsFromSource)
.post(MappingController.createMapping);

router.route("/add-product")
.patch(MappingController.addProductToMapping)
router.route("/similarity")
.get(MappingController.getSimilarityByTitleFromSource);

module.exports = router;