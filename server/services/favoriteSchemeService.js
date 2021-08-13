const FavoriteScheme = require("../models/favoriteScheme.model");

class FavoriteSchemeService {
  static async getList() {
    const list = await FavoriteScheme.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    const list = await FavoriteScheme.where({ user_id }).fetchAll({
      withRelated: ["scheme", "scheme.carMake", "scheme.user"],
    });
    return list;
  }

  static async getListBySchemeId(scheme_id) {
    const list = await FavoriteScheme.where({ scheme_id }).fetchAll({
      withRelated: ["user"],
    });
    return list;
  }

  static async getByID(id) {
    const favorite = await FavoriteScheme.where({ id }).fetch({
      withRelated: ["user", "scheme", "scheme.carMake", "scheme.user"],
    });
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteScheme.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    let favorite = await FavoriteScheme.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    const favorite = await FavoriteScheme.where({ id }).fetch();
    await favorite.destroy();
    return true;
  }
}

module.exports = FavoriteSchemeService;
