const express = require('express');
const UserController = require('../controllers/user.controller.js');
const WatchlistController = require('../controllers/watchlist.controller.js');

//router
const router = express.Router();

//user routes
router.route("/")
.get(UserController.isLoggedIn,WatchlistController.getAllWatchlist)
.post(UserController.isLoggedIn,WatchlistController.addToWatchlist);

router.route("/:watchlistId")
.get(UserController.isLoggedIn,WatchlistController.getAllProductsFromWatchlist)
.delete(UserController.isLoggedIn,WatchlistController.deleteWatchlist)
.patch(UserController.isLoggedIn,WatchlistController.renameWatchlist);

router.route("/:watchlistId/product/:productId")
.delete(UserController.isLoggedIn,WatchlistController.deleteProductFromWatchlist)
.post(UserController.isLoggedIn,WatchlistController.addProductToWatchlist);

//exports
module.exports = router;