exports.up = function (knex) {
  return knex("builder_overlays").update({ legacy_mode: 1 });
};

exports.down = function (knex) {};
