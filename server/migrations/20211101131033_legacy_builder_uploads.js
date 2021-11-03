exports.up = function (knex) {
  return knex.schema.table("builder_uploads", (table) => {
    table.boolean("legacy_mode").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_uploads", (table) => {
    table.boolean("legacy_mode").default(false);
  });
};
