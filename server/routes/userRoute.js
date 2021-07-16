const express = require("express");
const UserController = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(isAuthenticated, UserController.getList);

module.exports = router;
