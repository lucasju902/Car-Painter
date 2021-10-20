exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("shared_schemes", (table) => {
    table.increments("id").primary();
    table
      .integer("scheme_id")
      .notNull()
      .index()
      .references("id")
      .inTable("builder_schemes")
      .onDelete("cascade");
    table
      .integer("user_id")
      .notNull()
      .index()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.tinyint("editable").default(0);
    table.tinyint("accepted").default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("shared_schemes");
};
