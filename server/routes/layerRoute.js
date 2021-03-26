const express = require("express");
const LayerController = require("../controllers/layer.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, LayerController.getList)
  .post(isAuthenticated, LayerController.create);

router
  .route("/:id")
  .get(isAuthenticated, LayerController.getByID)
  .put(isAuthenticated, LayerController.update)
  .delete(isAuthenticated, LayerController.delete);

module.exports = router;
