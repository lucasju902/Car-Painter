const express = require("express");
const LeagueSeriesController = require("../controllers/leagueSeries.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, LeagueSeriesController.getList)
  .post(isAuthenticated, LeagueSeriesController.create);

router
  .route("/:id")
  .get(isAuthenticated, LeagueSeriesController.getByID)
  .put(isAuthenticated, LeagueSeriesController.update)
  .delete(isAuthenticated, LeagueSeriesController.delete);

router
  .route("/byUser/:id")
  .get(isAuthenticated, LeagueSeriesController.getListByUserID);

module.exports = router;
