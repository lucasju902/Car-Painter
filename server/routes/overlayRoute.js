const express = require("express");
const OverlayController = require("../controllers/overlay.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, OverlayController.getList)
  .post(isAuthenticated, OverlayController.create);

router
  .route("/:id")
  .get(isAuthenticated, OverlayController.getByID)
  .put(isAuthenticated, OverlayController.update);

module.exports = router;
