exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.integer("last_font");
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("last_font");
  });
};
