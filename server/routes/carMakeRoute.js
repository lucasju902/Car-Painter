const express = require("express");
const CarMakeController = require("../controllers/carMake.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, CarMakeController.getList)
  .post(isAuthenticated, CarMakeController.create);

router
  .route("/:id")
  .get(isAuthenticated, CarMakeController.getByID)
  .put(isAuthenticated, CarMakeController.update);

module.exports = router;
