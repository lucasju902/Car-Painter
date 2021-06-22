const config = require("../config");
const SchemeService = require("../services/schemeService");
const LayerService = require("../services/layerService");
const UploadService = require("../services/uploadService");
const CarMakeService = require("../services/carMakeService");
const logger = require("../config/winston");

class SchemeController {
  static async getList(req, res) {
    try {
      const { userID } = req.query;
      let schemes;
      if (userID) {
        schemes = await SchemeService.getListByUserID(userID);
      } else {
        schemes = await SchemeService.getList();
      }
      res.json(schemes);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getByID(req, res) {
    try {
      let scheme = await SchemeService.getById(req.params.id);
      scheme = scheme.toJSON();
      res.json({
        scheme: scheme,
        carMake: scheme.carMake,
        basePaints: scheme.carMake.bases,
        layers: scheme.layers,
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const { carMakeID, userID, name } = req.body;
      let carMake = await CarMakeService.getById(carMakeID);
      carMake = carMake.toJSON();
      let scheme = await SchemeService.create(userID, carMake.id, name);
      scheme = scheme.toJSON();
      let carMake_builder_layers = JSON.parse(carMake.builder_layers);
      let layer_index = 1;
      let builder_layers = [];
      for (let layer of carMake_builder_layers) {
        builder_layers.push(
          await LayerService.create({
            layer_type: 6,
            scheme_id: scheme.id,
            upload_id: 0,
            layer_data: JSON.stringify({
              img: layer.img,
              name: layer.name,
            }),
            layer_visible: layer.visible,
            layer_order: layer_index++,
            layer_locked: 0,
            time_modified: 0,
            confirm: "",
          })
        );
      }
      res.json({
        scheme: scheme,
        carMake: carMake,
        basePaints: carMake.bases,
        layers: builder_layers,
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
      let scheme = await SchemeService.updateById(req.params.id, req.body);
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async getListByUploadID(req, res) {
    try {
      let layers = await LayerService.getListByUploadID(req.params.id);
      layers = layers.toJSON();
      let schemes = [];
      for (let layer of layers) {
        if (!schemes.find((scheme) => scheme.id === layer.scheme.id)) {
          schemes.push(layer.scheme);
        }
      }
      res.json(schemes);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async uploadThumbnail(req, res) {
    try {
      let uploadFiles;
      if (config.bucketURL) {
        uploadFiles = UploadService.uploadFilesToS3("thumbnail");
      } else {
        uploadFiles = UploadService.uploadFiles("thumbnail");
      }
      uploadFiles(req, res, async function (err) {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          let { schemeID } = req.body;
          let scheme = await SchemeService.updateById(schemeID, {
            preview_pic: 1,
          });
          res.json(scheme);
        }
      });
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await SchemeService.deleteById(req.params.id);
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = SchemeController;
