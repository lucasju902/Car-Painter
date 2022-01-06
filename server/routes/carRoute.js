const express = require("express");
const CarController = require("../controllers/car.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, CarController.getList)
  .post(isAuthenticated, CarController.create);

router.route("/active").get(isAuthenticated, CarController.getActiveCar);

router
  .route("/:id")
  .get(isAuthenticated, CarController.getByID)
  .put(isAuthenticated, CarController.update);

module.exports = router;
