const BlockedUserSchemeService = require("../services/blockedUserService");
const logger = require("../config/winston");

class BlockedUserController {
  static async getList(req, res) {
    try {
      let list = await BlockedUserSchemeService.getList();
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByBlocker(req, res) {
    try {
      let list = await BlockedUserSchemeService.getListByBlockerId(
        req.params.id
      );
      res.json(list);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByBlockedUser(req, res) {
    try {
      let list = await BlockedUserSchemeService.getListByBlockedUserId(
        req.params.id
      );
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
      let row = await BlockedUserSchemeService.getById(req.params.id);
      res.json(row);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let row = await BlockedUserSchemeService.create(req.body);
      res.json(row);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let row = await BlockedUserSchemeService.updateById(
        req.params.id,
        req.body
      );
      res.json(row);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = BlockedUserController;
