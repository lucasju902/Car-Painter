const bookshelf = require("../config/bookshelf");
require("./base.model");
require("./scheme.model");
/**
 * CarMake model.
 */

const CarMake = bookshelf.model("CarMake", {
  tableName: "car_makes",
  schemes() {
    return this.hasMany("Scheme", "car_make");
  },
  bases() {
    return this.hasMany("Base", "car_make");
  },
});

module.exports = CarMake;
