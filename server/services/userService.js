const User = require("../models/user.model");

class UserService {
  static async getList() {
    const users = await User.forge().fetchAll();
    return users;
  }

  static async getById(id) {
    const user = await User.where({ id }).fetch({
      withRelated: ["blockedUsers", "blockedByUsers"],
    });
    return user;
  }

  static async getPremiumById(id) {
    const user = await User.where({ id, pro_user: 1 }).fetch();
    return user;
  }

  static async getByEmail(email) {
    const user = await User.where({ email }).fetch({
      withRelated: ["blockedUsers", "blockedByUsers"],
    });
    return user;
  }

  static async create(payload) {
    const user = await User.forge(payload).save();
    return user;
  }

  static async updateById(id, payload) {
    const user = await this.getById(id);
    await user.save(payload);
    return user;
  }
}

module.exports = UserService;
