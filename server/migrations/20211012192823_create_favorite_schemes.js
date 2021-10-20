exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("favorite_schemes", (table) => {
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
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("favorite_schemes");
};
