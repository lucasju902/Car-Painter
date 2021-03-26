const bookshelf = require("../config/bookshelf");

/**
 * Font model.
 */

const Font = bookshelf.model("Font", {
  tableName: "builder_fonts",
});

module.exports = Font;
