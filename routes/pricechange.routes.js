const router = require('express').Router();
const PricechangeController = require('../controllers/pricechange.controller.js');
const UserController = require('../controllers/user.controller.js');

router.route("/")
.get(UserController.isLoggedIn,PricechangeController.priceChangeGraph);

router.route("/product")
.get(UserController.isLoggedIn,PricechangeController.getLivePriceChanges);
module.exports = router;
