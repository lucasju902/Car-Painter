exports.up = function (knex) {
  return knex("builder_layers").delete().where("layer_data", "=", "{}");
};

exports.down = function (knex) {};
