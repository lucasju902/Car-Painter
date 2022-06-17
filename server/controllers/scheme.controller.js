const config = require("../config");
const SchemeService = require("../services/schemeService");
const LayerService = require("../services/layerService");
const FileService = require("../services/fileService");
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
        sharedUsers: scheme.sharedUsers,
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
      const { carMakeID, userID, name, legacy_mode } = req.body;
      let carMake = await CarMakeService.getById(carMakeID);
      carMake = carMake.toJSON();
      let legacyMode =
        legacy_mode ||
        !carMake.total_bases ||
        !carMake.builder_layers_2048 ||
        !carMake.builder_layers_2048.length
          ? 1
          : 0;
      let scheme = await SchemeService.create(
        userID,
        carMake.id,
        name,
        legacyMode
      );
      scheme = scheme.toJSON();
      await SchemeService.createCarmakeLayers(scheme, carMake, legacyMode);
      scheme = await SchemeService.getById(scheme.id);
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async renewCarMakeLayers(req, res) {
    try {
      const schemeID = req.params.id;
      let scheme = await SchemeService.getById(schemeID);
      await LayerService.deleteByQuery({
        scheme_id: schemeID,
        layer_type: 6,
      });
      scheme = scheme.toJSON();
      await SchemeService.createCarmakeLayers(scheme, scheme.carMake);
      const schemeUpdatePayload = {
        date_modified: Math.round(new Date().getTime() / 1000),
        last_modified_by: req.user.id,
      };
      await SchemeService.updateById(schemeID, schemeUpdatePayload);
      scheme = await SchemeService.getById(scheme.id);
      global.io.sockets.in(schemeID).emit("client-renew-carmake-layers");
      global.io.sockets
        .in("general")
        .emit("client-update-scheme", { data: scheme }); // General Room
      res.json(scheme);
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
        uploadFiles = FileService.uploadFilesToS3("thumbnail");
      } else {
        uploadFiles = FileService.uploadFiles("thumbnail");
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
            thumbnail_updated: 1,
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
      await LayerService.deleteAllBySchemeId(req.params.id);
      await SchemeService.deleteById(req.params.id);
      await FileService.deleteFileFromS3(
        `scheme_thumbnails/${req.params.id}.jpg`
      );
      global.io.sockets.in(req.params.id).emit("client-delete-scheme");
      global.io.sockets
        .in("general")
        .emit("client-delete-scheme", { data: { id: req.params.id } }); // General Room
      res.json({});
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }

  static async clone(req, res) {
    try {
      let scheme = await SchemeService.cloneById(req.params.id);
      scheme = scheme.toJSON();
      await FileService.cloneFileOnS3(
        `scheme_thumbnails/${req.params.id}.jpg`,
        `scheme_thumbnails/${scheme.id}.jpg`
      );
      res.json(scheme);
    } catch (err) {
      logger.log("error", err.stack);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = SchemeController;
