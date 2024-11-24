const router = require('express').Router();
const PricechangeController = require('../controllers/pricechange.controller.js');
const UserController = require('../controllers/user.controller.js');
const cacheMiddleware = require('../helpers/cacheMiddleware.js');

router.route("/")
.get(UserController.isLoggedIn,cacheMiddleware,PricechangeController.priceChangeGraph);

router.route("/product")
.get(UserController.isLoggedIn,cacheMiddleware,PricechangeController.getLivePriceChanges);
module.exports = router;
