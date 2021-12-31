const bookshelf = require("../config/bookshelf");

/**
 * LeagueSeries model.
 */

const LeagueSeries = bookshelf.model("LeagueSeries", {
  tableName: "league_series",
  league() {
    return this.belongsTo("League", "league_id");
  },
  dependents: ["league"],
});

module.exports = LeagueSeries;
