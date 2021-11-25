const _ = require("lodash");
const Layer = require("../models/layer.model");
const Scheme = require("../models/scheme.model");
const { generateRandomColor } = require("../utils/common");
const LayerService = require("./layerService");

class SchemeService {
  static async getList() {
    const schemes = await Scheme.where({
      avail: 1,
    }).fetchAll({
      withRelated: ["carMake", "carMake.bases", "layers"],
    });
    return schemes;
  }

  static async getListByUserID(user_id) {
    const schemes = await Scheme.where({
      user_id: user_id,
      avail: 1,
    }).fetchAll({
      withRelated: ["carMake", "layers", "user"],
    });
    return schemes;
  }

  static async getById(id) {
    const scheme = await Scheme.where({ id }).fetch({
      withRelated: [
        "carMake",
        "carMake.bases",
        "layers",
        "sharedUsers",
        "user",
        "lastModifier",
      ],
    });
    return scheme;
  }

  static async create(userID, carMakeID, name, legacy_mode) {
    let schemeName = name && name.length ? name : "Untitled Scheme";

    let schemeList = await this.getListByUserID(userID);
    schemeList = schemeList.toJSON();
    let number = 0;

    const defaultGuideData = {
      wireframe_opacity: 0.1,
      show_wireframe: true,
      sponsor_opacity: 0.3,
      show_sponsor: true,
      numberblock_opacity: 0.2,
      show_numberBlocks: true,
      show_number_block_on_top: true,
    };

    for (let item of schemeList) {
      if (item.name.includes(schemeName)) {
        const extraIndex = parseInt(item.name.substr(schemeName.length));
        if (!extraIndex) number = 1;
        else if (extraIndex >= number) number = extraIndex + 1;
      }
    }
    if (number) schemeName = `${schemeName} ${number}`;

    const scheme = await Scheme.forge({
      name: schemeName,
      base_color: generateRandomColor(),
      car_make: carMakeID,
      user_id: userID,
      date_created: Math.round(new Date().getTime() / 1000),
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: userID,
      preview_pic: 0,
      showroom_id: 0,
      base_id: 0,
      finished: 0,
      avail: 1,
      legacy_mode,
      guide_data: JSON.stringify(defaultGuideData),
    }).save();
    return scheme;
  }

  static async createCarmakeLayers(scheme, legacy = false) {
    let carMake = scheme.carMake;
    let carMake_builder_layers = JSON.parse(
      legacy ? carMake.builder_layers : carMake.builder_layers_2048
    );
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

    return builder_layers;
  }

  static async updateById(id, payload) {
    const scheme = await this.getById(id);
    await scheme.save(payload);
    return scheme;
  }

  static async deleteById(id) {
    const scheme = await this.getById(id);
    await scheme.destroy();
    return true;
  }

  static async cloneById(id) {
    let originalScheme = await Scheme.where({ id }).fetch({
      withRelated: ["layers"],
    });
    originalScheme = originalScheme.toJSON();

    let scheme = await Scheme.forge({
      ..._.omit(originalScheme, ["id", "layers"]),
      name: originalScheme.name.slice(0, 45) + " copy",
      date_created: Math.round(new Date().getTime() / 1000),
      date_modified: Math.round(new Date().getTime() / 1000),
    }).save();
    let schemeData = scheme.toJSON();
    for (let layer of originalScheme.layers) {
      Layer.forge({
        ..._.omit(layer, ["id"]),
        scheme_id: schemeData.id,
      }).save();
    }
    scheme = await this.getById(schemeData.id);
    return scheme;
  }
}

module.exports = SchemeService;
