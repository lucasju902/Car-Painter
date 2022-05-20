const bookshelf = require("../config/bookshelf");

/**
 * BlockedUser model.
 */

const BlockedUser = bookshelf.model("BlockedUser", {
  tableName: "blocked_users",
  blockerUser() {
    return this.belongsTo("User", "blocker_id");
  },
  blockedUser() {
    return this.belongsTo("User", "userid");
  },
  dependents: ["user"],
});

module.exports = BlockedUser;
