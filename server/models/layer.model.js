const bookshelf = require("../config/bookshelf");
require("./scheme.model");
/**
 * Layer model.
 */

const Layer = bookshelf.model("Layer", {
  tableName: "builder_layers",
  scheme() {
    return this.belongsTo("Scheme", "scheme_id");
  },
});

module.exports = Layer;
