exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.text("guide_data").defaultTo("{}");
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("guide_data");
  });
};
