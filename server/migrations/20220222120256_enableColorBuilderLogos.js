exports.up = function (knex) {
  return knex.schema.table("builder_logos", (table) => {
    table.boolean("enable_color").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_logos", (table) => {
    table.dropColumn("enable_color");
  });
};
