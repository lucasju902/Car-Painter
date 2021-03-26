const LayerService = require("../services/layerService");
const logger = require("../config/winston");

class LayerController {
  static async getList(req, res) {
    try {
      let layers = await LayerService.getList();
      res.json(layers);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let layer = await LayerService.getById(req.params.id);
      res.json(layer);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let layer = await LayerService.create(req.body);
      res.json(layer);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let layer = await LayerService.updateById(req.params.id, req.body);
      res.json(layer);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await LayerService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = LayerController;
