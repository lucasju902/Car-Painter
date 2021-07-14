const UserService = require("../services/userService");
const logger = require("../config/winston");

class UserController {
  static async getList(req, res) {
    try {
      let users = await UserService.getList();
      res.json(users);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let user = await UserService.getById(req.params.id);
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
      let user = await UserService.create(req.body);
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
      let user = await UserService.updateById(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = UserController;
