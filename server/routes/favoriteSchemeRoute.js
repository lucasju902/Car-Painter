const express = require("express");
const FavoriteSchemeController = require("../controllers/favoriteScheme.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, FavoriteSchemeController.getList)
  .post(isAuthenticated, FavoriteSchemeController.create);

router
  .route("/:id")
  .get(isAuthenticated, FavoriteSchemeController.getByID)
  .put(isAuthenticated, FavoriteSchemeController.update)
  .delete(isAuthenticated, FavoriteSchemeController.delete);

router
  .route("/byUser/:id")
  .get(isAuthenticated, FavoriteSchemeController.getListByUserID);

router
  .route("/byScheme/:id")
  .get(isAuthenticated, FavoriteSchemeController.getListBySchemeID);

module.exports = router;
