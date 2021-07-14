const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router.route("/login").post(AuthController.login);
router.route("/signup").post(AuthController.signup);
router.route("/me").get(isAuthenticated, AuthController.getMe);

module.exports = router;
