const Overlay = require("../models/overlay.model");
const LayerService = require("../services/layerService");

class OverlayService {
  static async getList() {
    const overlays = await Overlay.forge().fetchAll();
    return overlays;
  }

  static async getById(id) {
    const overlay = await Overlay.where({ id }).fetch();
    return overlay;
  }

  static async create(payload) {
    const overlay = await Overlay.forge(payload).save();
    return overlay;
  }

  static async updateById(id, payload) {
    const overlay = await this.getById(id);
    await overlay.save(payload);
    return overlay;
  }
}

module.exports = OverlayService;
