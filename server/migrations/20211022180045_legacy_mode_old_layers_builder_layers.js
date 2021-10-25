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

  for (let offset = 0; offset < totalLayers; offset += QUERY_LIMIT)
    queries.push(
      knex("builder_layers")
        .select("id")
        .select("layer_type")
        .select("layer_data")
        .whereIn("layer_type", [1, 2, 4, 5])
        .andWhere("builder_layers.id", ">=", offset)
        .andWhere("builder_layers.id", "<", offset + QUERY_LIMIT)
        .on("query", function (data) {
          console.log(data);
        })
        .then(async function (res) {
          for (let i = 0; i < res.length; i += BATCH_SIZE) {
            let sql = "UPDATE builder_layers u JOIN (";
            let nestedSql = "";

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
              layer_data.legacy = true;
              if (layer_data.rotation) layer_data.rotation = 0;
              if (layer_data.flop) layer_data.flop = 0;
              if (layer_data.flip) layer_data.flip = 0;

              let layer_type = originalData.layer_type;
              if (layer_type === 1) layer_type = 2;

              nestedSql += `SELECT ${originalData.id} as id, '${JSON.stringify(
                layer_data
              )}' as layer_data, ${layer_type} as layer_type `;
            }

            sql += `${nestedSql}) a on u.id = a.id SET u.layer_data = a.layer_data, u.layer_type = a.layer_type;`;
            await knex.raw(sql);
          }
        })
    );
  return Promise.all(queries);
};

exports.down = function (knex) {};
