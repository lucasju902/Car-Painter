const express = require("express");
const TeamController = require("../controllers/team.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, TeamController.getList)
  .post(isAuthenticated, TeamController.create);

router
  .route("/:id")
  .get(isAuthenticated, TeamController.getByID)
  .put(isAuthenticated, TeamController.update)
  .delete(isAuthenticated, TeamController.delete);

router
  .route("/byUser/:id")
  .get(isAuthenticated, TeamController.getListByUserID);

module.exports = router;
