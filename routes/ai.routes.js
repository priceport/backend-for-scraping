const router = require('express').Router();
const UserController = require('../controllers/user.controller.js');
const AiController = require('../controllers/ai.controller.js');

// router.route("/chat")
// .get(UserController.isLoggedIn,AiController.chat);

router.route("/analyze")
.post(UserController.isLoggedIn,AiController.analyze);

module.exports = router;