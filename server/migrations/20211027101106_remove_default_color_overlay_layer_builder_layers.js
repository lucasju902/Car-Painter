exports.up = async function (knex) {
  const BATCH_SIZE = 3000;
  let lastLayer = await knex("builder_layers")
    .select("id")
    .orderBy("id", "desc")
    .limit(1);
  const totalLayers = lastLayer[0].id;
  let queries = [];
  const QUERY_LIMIT = 50000;
  console.log("TotalLayers: ", totalLayers);

  let overlays = await knex("builder_overlays").select("id").select("color");
  let overlaysMap = {};
  for (let overlay of overlays) {
    overlaysMap[overlay.id] = overlay;
  }

  for (let offset = 0; offset < totalLayers; offset += QUERY_LIMIT)
    queries.push(
      knex("builder_layers")
        .select("id")
        .select("layer_data")
        .where("layer_type", "=", 4)
        .andWhere("builder_layers.id", ">=", offset)
        .andWhere("builder_layers.id", "<", offset + QUERY_LIMIT)
        .on("query", function (data) {
          console.log(data);
        })
        .then(async function (res) {
          for (let i = 0; i < res.length; i += BATCH_SIZE) {
            let sql = "UPDATE builder_layers u JOIN (";
            let nestedSql = "";
            let deletingIDs = [];

            for (let j = 0; j < BATCH_SIZE; j++) {
              const originalData = res[i + j];

              if (!originalData) {
                break;
              }

              if (j !== 0) {
                nestedSql += "UNION ALL ";
              }
              let fixedLayerDataString = originalData.layer_data.toString(
                "utf-8"
              );

              let layer_data = JSON.parse(
                fixedLayerDataString && fixedLayerDataString.length
                  ? fixedLayerDataString
                  : "{}"
              );

              console.log(originalData.id, layer_data);
              if (layer_data.id) {
                const overlay = overlaysMap[layer_data.id];
                if (!overlay) {
                  console.log("Deleting: ", originalData.id);
                  deletingIDs.push(originalData.id);
                } else {
                  if ("#" + overlay.color === layer_data.color) {
                    layer_data.color = null;
                  }
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
        })
    );
  return Promise.all(queries);
};

exports.down = function (knex) {};
