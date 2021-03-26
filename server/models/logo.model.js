const bookshelf = require("../config/bookshelf");

/**
 * Logo model.
 */

const Logo = bookshelf.model("Logo", {
  tableName: "builder_logos",
});

module.exports = Logo;
