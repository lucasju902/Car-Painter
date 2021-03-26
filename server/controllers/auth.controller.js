const logger = require("../config/winston");

class AuthController {
  static async login(req, res) {
    try {
      const { usr, hash } = req.body;
      if (usr && hash) {
        res.json({
          id: parseInt(usr),
          name: "TEST",
          email: "test@test.com",
        });
      } else {
        res.status(400).json({
          message: "Invalid UserID or Hash!",
        });
      }
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = AuthController;
