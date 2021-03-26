const bookshelf = require("../config/bookshelf");
require("./user.model");
require("./scheme.model");

/**
 * Upload model.
 */

const Upload = bookshelf.model("Upload", {
  tableName: "builder_uploads",
  user() {
    return this.belongsTo("User", "user_id");
  },
  scheme() {
    return this.belongsTo("Scheme", "scheme_id");
  },
});

module.exports = Upload;
