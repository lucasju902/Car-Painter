exports.up = function (knex) {
  return knex.schema.table("builder_logos", (table) => {
    table.boolean("active").default(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_logos", (table) => {
    table.dropColumn("active");
  });
};
