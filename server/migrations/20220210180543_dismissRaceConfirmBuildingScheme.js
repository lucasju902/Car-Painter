exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.boolean("dismiss_race_confirm").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("dismiss_race_confirm");
  });
};
