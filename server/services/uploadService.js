const Upload = require("../models/upload.model");

class UploadService {
  static async getList() {
    const uploads = await Upload.forge().fetchAll();
    return uploads;
  }

  static async getListByUserID(user_id) {
    const uploads = await Upload.where({
      user_id: user_id,
    }).fetchAll();
    return uploads;
  }

  static async getById(id) {
    const upload = await Upload.where({ id }).fetch();
    return upload;
  }

  static async create(payload) {
    const upload = await Upload.forge(payload).save();
    return upload;
  }

  static async updateById(id, payload) {
    const upload = await this.getById(id);
    await upload.save(payload);
    return upload;
  }

  static async deleteById(id) {
    const upload = await this.getById(id);
    await upload.destroy();
    return true;
  }
}

module.exports = UploadService;
