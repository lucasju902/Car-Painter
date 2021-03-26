const LogoService = require("../services/logoService");
const logger = require("../config/winston");

class LogoController {
  static async getList(req, res) {
    try {
      let logos = await LogoService.getList();
      res.json(logos);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let logo = await LogoService.getById(req.params.id);
      res.json(logo);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let logo = await LogoService.create(req.body);
      res.json(logo);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let logo = await LogoService.updateById(req.params.id, req.body);
      res.json(logo);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = LogoController;
