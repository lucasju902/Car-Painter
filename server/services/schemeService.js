const _ = require("lodash");
const Scheme = require("../models/scheme.model");

class SchemeService {
  static async getList() {
    const schemes = await Scheme.forge().fetchAll({
      withRelated: ["carMake", "carMake.bases", "layers"],
    });
    return schemes;
  }

  static async getListByUserID(user_id) {
    const schemes = await Scheme.where({
      user_id: user_id,
    }).fetchAll({
      withRelated: ["carMake", "layers"],
    });
    return schemes;
  }

  static async getById(id) {
    const scheme = await Scheme.where({ id }).fetch({
      withRelated: ["carMake", "carMake.bases", "layers"],
    });
    return scheme;
  }

  static async create(userID, carMakeID, name) {
    let schemeName = name;
    if (!name || !name.length) {
      let schemeList = await this.getListByUserID(userID);
      schemeList = schemeList.toJSON();
      let untitled = 0;
      for (let item of schemeList) {
        if (item.name.includes("Untitled Scheme")) {
          const untitledIndex = parseInt(item.name.substr(15));
          if (untitledIndex) {
            if (untitledIndex >= untitled) untitled = untitledIndex + 1;
          } else {
            untitled = 1;
          }
        }
      }
      schemeName = untitled ? `Untitled Scheme ${untitled}` : "Untitled Scheme";
    }

    const scheme = await Scheme.forge({
      name: schemeName,
      base_color: "ffffff",
      car_make: carMakeID,
      user_id: userID,
      date_created: Math.round(new Date().getTime() / 1000),
      date_modified: Math.round(new Date().getTime() / 1000),
      preview_pic: 0,
      showroom_id: 0,
      base_id: 0,
      finished: 0,
      avail: 1,
    }).save();
    return scheme;
  }

  static async updateById(id, payload) {
    const scheme = await this.getById(id);
    await scheme.save(payload);
    return scheme;
  }
}

module.exports = SchemeService;
