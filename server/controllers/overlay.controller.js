const OverlayService = require("../services/overlayService");
const logger = require("../config/winston");

class OverlayController {
  static async getList(req, res) {
    try {
      let overlays = await OverlayService.getList();
      res.json(overlays);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let overlay = await OverlayService.getById(req.params.id);
      res.json(overlay);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let overlay = await OverlayService.create(req.body);
      res.json(overlay);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let overlay = await OverlayService.updateById(req.params.id, req.body);
      res.json(overlay);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = OverlayController;
