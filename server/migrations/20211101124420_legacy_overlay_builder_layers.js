exports.up = function (knex) {
  return knex.schema.table("builder_overlays", (table) => {
    table.boolean("legacy_mode").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_overlays", (table) => {
    table.boolean("legacy_mode").default(false);
  });
};
