const express = require("express");
const LogoController = require("../controllers/logo.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, LogoController.getList)
  .post(isAuthenticated, LogoController.create);

router
  .route("/:id")
  .get(isAuthenticated, LogoController.getByID)
  .put(isAuthenticated, LogoController.update);

module.exports = router;
