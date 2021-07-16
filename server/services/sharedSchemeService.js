const SharedScheme = require("../models/sharedScheme.model");

class SharedSchemeService {
  static async getList() {
    const list = await SharedScheme.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    const list = await SharedScheme.where({ user_id }).fetchAll({
      withRelated: ["scheme", "scheme.carMake"],
    });
    return list;
  }

  static async getListBySchemeId(scheme_id) {
    const list = await SharedScheme.where({ scheme_id }).fetchAll({
      withRelated: ["user"],
    });
    return list;
  }

  static async getByID(id) {
    const shared = await SharedScheme.where({ id }).fetch({
      withRelated: ["user", "scheme"],
    });
    return shared;
  }

  static async create(payload) {
    const shared = await SharedScheme.forge(payload).save();
    return shared;
  }

  static async updateById(id, payload) {
    const shared = await this.getById(id);
    await shared.save(payload);
    return shared;
  }

  static async deleteById(id) {
    const shared = await this.getById(id);
    await shared.destroy();
    return true;
  }
}

module.exports = SharedSchemeService;
