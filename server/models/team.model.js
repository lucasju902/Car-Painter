const bookshelf = require("../config/bookshelf");

/**
 * Team model.
 */

const Team = bookshelf.model("Team", {
  tableName: "teams",
  user() {
    return this.belongsTo("User", "userid");
  },
  dependents: ["user"],
});

module.exports = Team;
