exports.up = function (knex) {
  return knex.schema.table("builder_overlays", (table) => {
    table.float("stroke_scale").default(1);
  });
};

exports.down = function (knex) {
  return knex.schema.table("builder_overlays", (table) => {
    table.dropColumn("stroke_scale");
  });
};
