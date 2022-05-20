const UserService = require("../services/userService");

const isAuthenticated = async (req, res, next) => {
  const token = JSON.parse(req.headers.authorization);

  if (token && token.usr && token.hash) {
    try {
      let user = await UserService.getById(parseInt(token.usr));
      user = user.toJSON();
      if (user.password === token.hash) {
        req.user = user;
        next();
      } else {
        res.status(401).json({
          message: "Invalid token.",
        });
      }
    } catch (_err) {
      console.log("error: ", _err);
      res.status(401).json({
        message: "Invalid token.",
      });
    }
  } else {
    res.status(401).json({
      message: "No token provided.",
    });
  }
};

module.exports = {
  isAuthenticated,
};
