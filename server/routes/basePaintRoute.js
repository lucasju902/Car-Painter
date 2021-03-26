const express = require("express");
const BasePaintController = require("../controllers/basePaint.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, BasePaintController.getList)
  .post(isAuthenticated, BasePaintController.create);

router
  .route("/:id")
  .get(isAuthenticated, BasePaintController.getByID)
  .put(isAuthenticated, BasePaintController.update);

module.exports = router;
