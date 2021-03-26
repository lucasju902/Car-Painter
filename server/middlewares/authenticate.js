// const CMSService = require("../services/cmsService");

const isAuthenticated = async (req, res, next) => {
  const token = JSON.parse(req.headers.authorization);

  if (token) {
    try {
      //   const user = await CMSService.getUserProfile(token);
      //   req.user = user;
      req.user = {
        id: token.usr,
      };
      // console.log("Token: ", token);
      next();
    } catch (_err) {
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
