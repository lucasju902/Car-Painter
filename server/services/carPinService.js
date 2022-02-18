const CarPin = require("../models/carPin.model");

class CarPinService {
  static async getList() {
    const list = await CarPin.forge().fetchAll();
    return list;
  }

  static async getListByUserId(userid) {
    const list = await CarPin.where({ userid }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const carPin = await CarPin.where({ id }).fetch();
    return carPin;
  }

  static async create(payload) {
    let carPin = await CarPin.forge(payload).save();
    carPin = carPin.toJSON();
    carPin = this.getByID(carPin.id);
    return carPin;
  }

  static async updateById(id, payload) {
    let carPin = await CarPin.where({ id }).fetch();
    await carPin.save(payload);
    carPin = this.getByID(id);
    return carPin;
  }

  static async deleteById(id) {
    const carPin = await CarPin.where({ id }).fetch();
    await carPin.destroy();
    return true;
  }
}

module.exports = CarPinService;
