const UploadService = require("../services/uploadService");
const LayerService = require("../services/layerService");
const logger = require("../config/winston");
const config = require("../config");

class UploadController {
  static async getList(req, res) {
    try {
      let uploads = await UploadService.getList();
      res.json(uploads);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUserID(req, res) {
    try {
      let uploads = await UploadService.getListByUserID(req.params.id);
      res.json(uploads);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let upload = await UploadService.getById(req.params.id);
      res.json(upload);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      let upload = await UploadService.create(req.body);
      res.json(upload);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadFiles(req, res) {
    try {
      let uploadFiles;
      if (config.bucketURL) {
        uploadFiles = UploadService.uploadFilesToS3();
      } else {
        uploadFiles = UploadService.uploadFiles();
      }
      uploadFiles(req, res, async function (err) {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { userID, schemeID, fileNames } = req.body;
          fileNames = JSON.parse(fileNames);
          let uploads = [];
          for (let fileName of fileNames) {
            uploads.push(
              await UploadService.create({
                user_id: parseInt(userID),
                scheme_id: parseInt(schemeID),
                file_name: `uploads/${userID}_${fileName}`,
              })
            );
          }
          res.json(uploads);
        }
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let upload = await UploadService.updateById(req.params.id, req.body);
      res.json(upload);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      let { deleteFromAll } = req.body;
      let upload = await UploadService.getById(req.params.id);
      upload = upload.toJSON();
      if (deleteFromAll) {
        await UploadService.deleteFileFromS3(upload.file_name);
        let layers = await LayerService.getListByUploadID(req.params.id);
        layers = layers.toJSON();
        let promises = [];

        for (let layer of layers) {
          promises.push(
            new Promise(async (resolve) => {
              await LayerService.deleteById(layer.id);
              resolve();
            })
          );
        }
        await Promise.all(promises);
      }
      await UploadService.deleteById(upload.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = UploadController;
