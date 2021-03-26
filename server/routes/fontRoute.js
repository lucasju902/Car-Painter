const express = require("express");
const FontController = require("../controllers/font.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, FontController.getList)
  .post(isAuthenticated, FontController.create);

router
  .route("/:id")
  .get(isAuthenticated, FontController.getByID)
  .put(isAuthenticated, FontController.update);

module.exports = router;
