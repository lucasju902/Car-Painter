exports.up = function (knex) {
  const BATCH_SIZE = 3000;
  return knex("builder_share")
    .select("builder_share.scheme_id")
    .select("builder_share.user_id")
    .join("builder_schemes", "builder_share.scheme_id", "builder_schemes.id")
    .join("users", "builder_share.user_id", "users.id")
    .then(async function (res) {
      for (let i = 0; i < res.length; i += BATCH_SIZE) {
        let rawsToInsert = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
          const originalData = res[i + j];

          if (!originalData) {
            break;
          }

          rawsToInsert.push({
            scheme_id: originalData.scheme_id,
            user_id: originalData.user_id,
            editable: 1,
            accepted: 0,
          });
        }
        await knex("shared_schemes").insert(rawsToInsert);
      }
    });
};

exports.down = function (knex) {};
