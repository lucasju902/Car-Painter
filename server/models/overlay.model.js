const bookshelf = require("../config/bookshelf");
require("./user.model");

/**
 * Overlay model.
 */

const Overlay = bookshelf.model("Overlay", {
  tableName: "builder_overlays",
  user() {
    return this.belongsTo("User", "userid");
  },
});

module.exports = Overlay;
