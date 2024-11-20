const router = require('express').Router();
const PricechangeController = require('../controllers/pricechange.controller.js');


router.route("/")
.get(PricechangeController.priceChangeGraph);

router.route("/product")
.get(PricechangeController.getLivePriceChanges);
module.exports = router;
