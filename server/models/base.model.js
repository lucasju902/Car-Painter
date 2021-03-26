const bookshelf = require("../config/bookshelf");
require("./carMake.model");
require("./user.model");

/**
 * Base model.
 */

const Base = bookshelf.model("Base", {
  tableName: "builder_bases",
  carMake() {
    return this.belongsTo("CarMake", "car_make");
  },
  User() {
    return this.belongsTo("User", "userid");
  },
});

module.exports = Base;
