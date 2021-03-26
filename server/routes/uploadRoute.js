const express = require("express");
const UploadController = require("../controllers/upload.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, UploadController.getList)
  .post(isAuthenticated, UploadController.create);

router
  .route("/byUserID/:id")
  .get(isAuthenticated, UploadController.getListByUserID);

router
  .route("/uploadFiles")
  .post(isAuthenticated, UploadController.uploadFiles);

router
  .route("/:id")
  .get(isAuthenticated, UploadController.getByID)
  .put(isAuthenticated, UploadController.update);

module.exports = router;
