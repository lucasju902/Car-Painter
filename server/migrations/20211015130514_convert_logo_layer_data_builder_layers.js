exports.up = function (knex) {
  const BATCH_SIZE = 3000;
  return knex("builder_layers")
    .select("id")
    .select("layer_data")
    .where("layer_type", "=", 2)
    .then(async function (res) {
      let logos = await knex("builder_logos").select();
      let logoMap = {};
      for (let logo of logos) {
        logoMap[logo.id] = logo;
      }

      for (let i = 0; i < res.length; i += BATCH_SIZE) {
        let sql = "UPDATE builder_layers u JOIN (";
        let nestedSql = "";
        let deletingIDs = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
          const originalData = res[i + j];

          if (!originalData) {
            break;
          }

          let layer_data = JSON.parse(
            originalData.layer_data && originalData.layer_data.length
              ? originalData.layer_data.toString("utf-8")
              : "{}"
          );
          if (j !== 0) {
            nestedSql += "UNION ALL ";
          }

          console.log(originalData.id, layer_data);
          if (layer_data.sponsor) {
            const logo = logoMap[parseInt(layer_data.sponsor)];
            if (!logo) {
              console.log("Deleting: ", originalData.id);
              deletingIDs.push(originalData.id);
            } else {
              layer_data.source_file = logo.source_file;
              layer_data.preview_file = logo.preview_file;
            }
          }
          nestedSql += `SELECT ${originalData.id} as id, '${JSON.stringify(
            layer_data
          )}' as layer_data `;
        }

        sql += `${nestedSql}) a on u.id = a.id SET u.layer_data = a.layer_data;`;
        await knex.raw(sql);

        if (deletingIDs.length) {
          await knex("builder_layers").delete().whereIn("id", deletingIDs);
        }
      }
    });
};

exports.down = function (knex) {};
