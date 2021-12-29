exports.up = function (knex) {
  return knex("builder_logos")
    .update({
      active: false,
    })
    .whereNot({
      type: "flag",
    });
};

exports.down = function (knex) {
  return knex("builder_logos").update({
    active: true,
  });
};
