const express = require("express");
const SchemeController = require("../controllers/scheme.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, SchemeController.getList)
  .post(isAuthenticated, SchemeController.create);

router
  .route("/:id")
  .get(isAuthenticated, SchemeController.getByID)
  .put(isAuthenticated, SchemeController.update);

router
  .route("/byUpload/:id")
  .get(isAuthenticated, SchemeController.getListByUploadID);

router
  .route("/thumbnail")
  .post(isAuthenticated, SchemeController.uploadThumbnail);

module.exports = router;
