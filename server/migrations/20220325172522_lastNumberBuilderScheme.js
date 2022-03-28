exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.integer("last_number").default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("last_number");
  });
};
