exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("hide_spec").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("hide_spec");
  });
};
