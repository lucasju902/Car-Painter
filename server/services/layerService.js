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

  static async create(payload) {
    const layer = await Layer.forge(payload).save();
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
