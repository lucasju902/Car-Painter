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
        .select("builder_layers.id")
        .select("layer_data")
        .select("car_makes.id as car_id")
        .select("car_makes.builder_layers")
        .leftJoin(
          "builder_schemes",
          "builder_layers.scheme_id",
          "builder_schemes.id"
        )
        .leftJoin("car_makes", "builder_schemes.car_make", "car_makes.id")
        .where("layer_type", "=", 6)
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
              let fixedLayerDataString = originalData.layer_data
                .replace("	", "")
                .replace("\\", "")
                .replace("\n", " ")
                .toString("utf-8");

              let layer_data = JSON.parse(
                fixedLayerDataString && fixedLayerDataString.length
                  ? fixedLayerDataString
                  : "{}"
              );

              let layersJSON;
              try {
                layersJSON = JSON.parse(
                  originalData.builder_layers.toString("utf-8")
                );
              } catch (e) {
                console.log(
                  "----------------------",
                  originalData.car_id,
                  e.message
                );
                return;
              }

              let layersMap = {};
              for (let layer of layersJSON) {
                layersMap[layer.name] = layer;
              }

              console.log(originalData.id, layer_data);
              if (layer_data.name) {
                const layer = layersMap[layer_data.name];
                if (!layer) {
                  console.log("Deleting: ", originalData.id);
                  deletingIDs.push(originalData.id);
                } else {
                  layer_data.img = layer.img;
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
