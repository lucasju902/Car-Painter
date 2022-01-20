exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("race_updated").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("race_updated");
  });
};
