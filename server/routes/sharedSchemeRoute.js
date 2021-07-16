const express = require("express");
const SharedSchemeController = require("../controllers/sharedScheme.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, SharedSchemeController.getList)
  .post(isAuthenticated, SharedSchemeController.create);

router
  .route("/:id")
  .get(isAuthenticated, SharedSchemeController.getByID)
  .put(isAuthenticated, SharedSchemeController.update)
  .delete(isAuthenticated, SharedSchemeController.delete);

router
  .route("/byUser/:id")
  .get(isAuthenticated, SharedSchemeController.getListByUserID);

router
  .route("/byScheme/:id")
  .get(isAuthenticated, SharedSchemeController.getListBySchemeID);

module.exports = router;
