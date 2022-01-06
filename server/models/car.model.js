const bookshelf = require("../config/bookshelf");
require("./base.model");
require("./scheme.model");
/**
 * Car model.
 */

const Car = bookshelf.model("Car", {
  tableName: "cars",
});

module.exports = Car;
