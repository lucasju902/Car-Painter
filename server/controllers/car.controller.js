const CarService = require("../services/carService");
const logger = require("../config/winston");

class CarController {
  static async getList(req, res) {
    try {
      let cars = await CarService.getList();
      res.json(cars);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let car = await CarService.getById(req.params.id);
      res.json(car);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getActiveCar(req, res) {
    try {
      const { userID, carMake } = req.query;
      let car = await CarService.getActiveCar(userID, carMake);
      res.json(car);
    } catch (err) {
      if (err.message === "EmptyResponse") {
        res.status(200).json(null);
      } else {
        logger.log("error", err.stack);
        res.status(500).json({
          message: err.message,
        });
      }
    }
  }

  static async create(req, res) {
    try {
      let car = await CarService.create(req.body);
      res.json(car);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let car = await CarService.updateById(req.params.id, req.body);
      res.json(car);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = CarController;
