const express = require("express");
const BlockedUserController = require("../controllers/blockedUser.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, BlockedUserController.getList)
  .post(isAuthenticated, BlockedUserController.create);

router
  .route("/blocker/:id")
  .get(isAuthenticated, BlockedUserController.getListByBlocker);

router
  .route("/blocked/:id")
  .get(isAuthenticated, BlockedUserController.getListByBlockedUser);

router
  .route("/:id")
  .get(isAuthenticated, BlockedUserController.getByID)
  .put(isAuthenticated, BlockedUserController.update);

module.exports = router;
