const bookshelf = require("../config/bookshelf");

/**
 * League model.
 */

const League = bookshelf.model("League", {
  tableName: "leagues",
  user() {
    return this.belongsTo("User", "userid");
  },
  dependents: ["user"],
});

module.exports = League;
