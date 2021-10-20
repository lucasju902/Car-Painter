exports.up = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.integer("last_modified_by").default(0);
    table.text("guide_data").defaultTo("{}").alter();
    table.boolean("legacy_mode").default(false);
    table.boolean("thumbnail_updated").default(false);
    table.varchar("finish").defaultTo("#0000FF");
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_schemes", (table) => {
    table.dropColumn("last_modified_by");
    table.dropColumn("legacy_mode");
    table.dropColumn("thumbnail_updated");
    table.dropColumn("finish");
  });
};
