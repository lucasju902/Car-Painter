const FontService = require("../services/fontService");
const logger = require("../config/winston");

class FontController {
  static async getList(req, res) {
    try {
      let fonts = await FontService.getList();
      res.json(fonts);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let font = await FontService.getById(req.params.id);
      res.json(font);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let font = await FontService.create(req.body);
      res.json(font);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let font = await FontService.updateById(req.params.id, req.body);
      res.json(font);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = FontController;
