const SharedSchemeService = require("../services/sharedSchemeService");
const logger = require("../config/winston");

class SharedSchemeController {
  static async getList(req, res) {
    try {
      let list = await SharedSchemeService.getList();
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUserID(req, res) {
    try {
      let list = await SharedSchemeService.getListByUserId(req.params.id);
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListBySchemeID(req, res) {
    try {
      let list = await SharedSchemeService.getListBySchemeId(req.params.id);
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let user = await SharedSchemeService.getById(req.params.id);
      res.json(user);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let user = await SharedSchemeService.create(req.body);
      res.json(user);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let user = await SharedSchemeService.updateById(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await SharedSchemeService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = SharedSchemeController;
