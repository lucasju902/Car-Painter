const express = require("express");
const CarPinController = require("../controllers/carPin.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, CarPinController.getList)
  .post(isAuthenticated, CarPinController.create);

router
  .route("/:id")
  .get(isAuthenticated, CarPinController.getByID)
  .put(isAuthenticated, CarPinController.update)
  .delete(isAuthenticated, CarPinController.delete);

router
  .route("/byUser/:id")
  .get(isAuthenticated, CarPinController.getListByUserID);

module.exports = router;
