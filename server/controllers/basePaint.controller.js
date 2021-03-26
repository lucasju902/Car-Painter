const BasePaintService = require("../services/basePaintService");
const logger = require("../config/winston");

class BasePaintController {
  static async getList(req, res) {
    try {
      let basePaints = await BasePaintService.getList();
      res.json(basePaints);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let basePaint = await BasePaintService.getById(req.params.id);
      res.json(basePaint);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let basePaint = await BasePaintService.create(req.body);
      res.json(basePaint);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let basePaint = await BasePaintService.updateById(
        req.params.id,
        req.body
      );
      res.json(basePaint);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = BasePaintController;
