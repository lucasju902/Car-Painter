const CarMakeService = require("../services/carMakeService");
const logger = require("../config/winston");

class CarMakeController {
  static async getList(req, res) {
    try {
      let carMakes = await CarMakeService.getList();
      res.json(carMakes);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let carMake = await CarMakeService.getById(req.params.id);
      res.json(carMake);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let carMake = await CarMakeService.create(req.body);
      res.json(carMake);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let carMake = await CarMakeService.updateById(req.params.id, req.body);
      res.json(carMake);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = CarMakeController;
