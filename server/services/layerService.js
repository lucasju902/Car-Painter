const Layer = require("../models/layer.model");

class LayerService {
  static async getList() {
    const layers = await Layer.forge().fetchAll();
    return layers;
  }

  static async getById(id) {
    const layer = await Layer.where({ id }).fetch();
    return layer;
  }

  static async getListByUploadID(uploadID) {
    const layers = await Layer.where({
      layer_type: 5,
      upload_id: uploadID,
    }).fetchAll({
      withRelated: ["scheme"],
    });
    return layers;
  }

  static async create(payload) {
    let scheme_layers = await Layer.where({
      scheme_id: payload.scheme_id,
    }).fetchAll();
    scheme_layers = scheme_layers.toJSON();
    let layer_data = JSON.parse(payload.layer_data);
    let layerName = layer_data.name;
    let number = 0;

    for (let layerItem of scheme_layers) {
      let item_layer_data = layerItem.layer_data
        ? JSON.parse(layerItem.layer_data)
        : null;
      if (item_layer_data && item_layer_data.name.indexOf(layerName) === 0) {
        const extraSpace = item_layer_data.name.substr(layerName.length);
        if (!isNaN(extraSpace)) {
          number = extraSpace === "" ? 1 : parseInt(extraSpace) + 1;
        }
      }
    }
    if (number) layerName = `${layerName} ${number}`;
    layer_data.name = layerName;
    const layer = await Layer.forge({
      ...payload,
      layer_data: JSON.stringify(layer_data),
    }).save(null, { method: "insert" });
    return layer;
  }

  static async updateById(id, payload) {
    const layer = await this.getById(id);
    await layer.save(payload);
    return layer;
  }

  static async deleteById(id) {
    const layer = await this.getById(id);
    await layer.destroy();
    return true;
  }

  static async deleteAllBySchemeId(scheme_id) {
    let scheme_layers = await Layer.where({
      scheme_id,
    }).fetchAll();
    for (let layer of scheme_layers) {
      await layer.destroy();
    }
    return true;
  }

  static async deleteByQuery(query) {
    let scheme_layers = await Layer.where(query).fetchAll();
    for (let layer of scheme_layers) {
      await layer.destroy();
    }
    return true;
  }
}

module.exports = LayerService;
