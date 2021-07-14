const _ = require("lodash");
const UserService = require("../services/userService");
const logger = require("../config/winston");
const md5 = require("md5");

class AuthController {
  static async login(req, res) {
    try {
      const { usr, password } = req.body;
      if (usr && password) {
        let user;
        if (usr.includes("@")) user = await UserService.getByEmail(usr);
        else user = await UserService.getById(parseInt(usr));
        user = user.toJSON();
        if (user.password === md5(password)) {
          res.json({
            user: _.omit(user, ["password"]),
            token: encodeURIComponent(`usr=${user.id}&hash=${user.password}`),
          });
        } else {
          res.status(400).json({
            message: "Invalid Password!",
          });
        }
      } else {
        res.status(400).json({
          message: "Invalid User or Password!",
        });
      }
    } catch (err) {
      logger.log("error", err.stack);
      res.status(400).json({
        message: "Invalid UserID or Password!",
      });
    }
  }

  static async getMe(req, res) {
    res.json(req.user);
  }

  static async signup(req, res) {
    try {
      const { id, email, password } = req.body;
      if (id && email && password) {
        let user = await UserService.create({
          id,
          email,
          password: md5(password),
        });
        user = user.toJSON();
        res.json({
          user: _.omit(user, ["password"]),
          token: encodeURIComponent(`usr=${user.id}&hash=${user.password}`),
        });
      } else {
        res.status(400).json({
          message: "Invalid Request!",
        });
      }
    } catch (err) {
      logger.log("error", err.stack);
      res.status(400).json({
        message: "Invalid UserID or Password!",
      });
    }
  }
}

module.exports = AuthController;
