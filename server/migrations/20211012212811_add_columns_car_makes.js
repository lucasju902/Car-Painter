exports.up = function (knex) {
  return knex.schema.table("car_makes", (table) => {
    table.tinyint("total_bases").default(24);
    table.longtext("builder_layers_2048");
  });
};

exports.down = function (knex) {
  return knex.schema.table("car_makes", (table) => {
    table.dropColumn("total_bases");
    table.dropColumn("builder_layers_2048");
  });
};
