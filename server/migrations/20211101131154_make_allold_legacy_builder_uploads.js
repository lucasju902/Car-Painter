exports.up = function (knex) {
  return knex("builder_uploads").update({ legacy_mode: 1 });
};

exports.down = function (knex) {};
