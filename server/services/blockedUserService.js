const BlockedUserScheme = require("../models/blockedUser.model");

class BlockedUserSchemeService {
  static async getList() {
    const list = await BlockedUserScheme.forge().fetchAll();
    return list;
  }

  static async getListByBlockerId(blocker_id) {
    const list = await BlockedUserScheme.where({ blocker_id }).fetchAll();
    return list;
  }

  static async getListByBlockedUserId(userid) {
    const list = await BlockedUserScheme.where({ userid }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const blockRow = await BlockedUserScheme.where({ id }).fetch();
    return blockRow;
  }

  static async create(payload) {
    let blockRow = await BlockedUserScheme.forge(payload).save();
    blockRow = blockRow.toJSON();
    blockRow = this.getByID(blockRow.id);
    return blockRow;
  }

  static async updateById(id, payload) {
    let blockRow = await BlockedUserScheme.where({ id }).fetch();
    await blockRow.save(payload);
    blockRow = this.getByID(id);
    return blockRow;
  }

  static async deleteById(id) {
    const blockRow = await BlockedUserScheme.where({ id }).fetch();
    await blockRow.destroy();
    return true;
  }
}

module.exports = BlockedUserSchemeService;
