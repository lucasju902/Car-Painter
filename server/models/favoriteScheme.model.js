const bookshelf = require("../config/bookshelf");

/**
 * FavoriteScheme model.
 */

const FavoriteScheme = bookshelf.model("FavoriteScheme", {
  tableName: "favorite_schemes",
  user() {
    return this.belongsTo("User", "user_id");
  },
  scheme() {
    return this.belongsTo("Scheme", "scheme_id");
  },
  dependents: ["user", "scheme"],
});

module.exports = FavoriteScheme;
