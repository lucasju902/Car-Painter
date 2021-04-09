const SchemeService = require("../services/schemeService");
const LayerService = require("../services/layerService");
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
      const { carMakeID, userID } = req.body;
      let carMake = await CarMakeService.getById(carMakeID);
      carMake = carMake.toJSON();
      let scheme = await SchemeService.create(userID, carMake.id);
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
}

module.exports = SchemeController;
