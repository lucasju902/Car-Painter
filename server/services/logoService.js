const Logo = require("../models/logo.model");
const LayerService = require("../services/layerService");

class LogoService {
  static async getList() {
    const logos = await Logo.forge().fetchAll();
    return logos;
  }

  static async getById(id) {
    const logo = await Logo.where({ id }).fetch();
    return logo;
  }

  static async create(payload) {
    const logo = await Logo.forge(payload).save();
    return logo;
  }

  static async updateById(id, payload) {
    const logo = await this.getById(id);
    await logo.save(payload);
    return logo;
  }
}

module.exports = LogoService;
