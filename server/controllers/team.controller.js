const TeamService = require("../services/TeamService");
const logger = require("../config/winston");

class TeamController {
  static async getList(req, res) {
    try {
      let list = await TeamService.getList();
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
      let list = await TeamService.getListByUserId(req.params.id);
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
      let favorite = await TeamService.getById(req.params.id);
      res.json(favorite);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let favorite = await TeamService.create(req.body);
      res.json(favorite);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let favorite = await TeamService.updateById(req.params.id, req.body);
      res.json(favorite);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await TeamService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = TeamController;
