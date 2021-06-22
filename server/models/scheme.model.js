const bookshelf = require("../config/bookshelf");

/**
 * Scheme model.
 */

const Scheme = bookshelf.model("Scheme", {
  tableName: "builder_schemes",
  user() {
    return this.belongsTo("User", "user_id");
  },
  carMake() {
    return this.belongsTo("CarMake", "car_make");
  },
  layers() {
    return this.hasMany("Layer", "scheme_id");
  },
  uploads() {
    return this.hasMany("Upload", "scheme_id");
  },
  dependents: ["layers"],
});

module.exports = Scheme;
