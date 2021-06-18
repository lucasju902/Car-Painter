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
    const layers = await Layer.query((qb) => {
      qb.whereRaw(
        `layer_type = 5 AND (layer_data LIKE '%"id":${uploadID},%' OR layer_data LIKE '%"id":${uploadID}}%')`
      );
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
      let item_layer_data = JSON.parse(layerItem.layer_data);
      if (item_layer_data.name.includes(layerName)) {
        const extraIndex = parseInt(
          item_layer_data.name.substr(layerName.length)
        );
        if (!extraIndex) number = 1;
        else if (extraIndex >= number) number = extraIndex + 1;
      }
    }
    if (number) layerName = `${layerName} ${number}`;
    layer_data.name = layerName;
    const layer = await Layer.forge({
      ...payload,
      layer_data: JSON.stringify(layer_data),
    }).save();
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
}

module.exports = LayerService;
