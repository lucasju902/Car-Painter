const bookshelf = require("../config/bookshelf");

/**
 * CarPin model.
 */

const CarPin = bookshelf.model("CarPin", {
  tableName: "car_pins",
  carMake() {
    return this.belongsTo("CarMake", "car_make");
  },
  user() {
    return this.belongsTo("User", "userid");
  },
  dependents: ["user"],
});

module.exports = CarPin;
