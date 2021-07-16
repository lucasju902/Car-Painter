const bookshelf = require("../config/bookshelf");

/**
 * SharedScheme model.
 */

const SharedScheme = bookshelf.model("SharedScheme", {
  tableName: "shared_schemes",
  user() {
    return this.belongsTo("User", "user_id");
  },
  scheme() {
    return this.belongsTo("Scheme", "scheme_id");
  },
  dependents: ["user", "scheme"],
});

module.exports = SharedScheme;
