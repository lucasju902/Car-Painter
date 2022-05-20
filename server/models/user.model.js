const bookshelf = require("../config/bookshelf");
require("./scheme.model");
require("./sharedScheme.model");
require("./base.model");
require("./overlay.model");
require("./upload.model");
require("./blockedUser.model");

/**
 * User model.
 */

const User = bookshelf.model("User", {
  tableName: "users",
  schemes() {
    return this.hasMany("Scheme", "user_id");
  },
  sharedSchemes() {
    return this.hasMany("SharedScheme", "user_id");
  },
  bases() {
    return this.hasMany("Base", "userid");
  },
  overlays() {
    return this.hasMany("Overlay", "userid");
  },
  uploads() {
    return this.hasMany("Upload", "user_id");
  },
  blockedByUsers() {
    return this.hasMany("BlockedUser", "userid");
  },
  blockedUsers() {
    return this.hasMany("BlockedUser", "blocker_id");
  },
});

module.exports = User;
