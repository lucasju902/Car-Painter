exports.up = async function (knex) {
  const BATCH_SIZE = 3000;
  return knex("builder_layers")
    .select("id")
    .select("layer_data")
    .where("layer_type", "=", 3)
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

          let fixedLayerDataString = originalData.layer_data.toString("utf-8");
          console.log(originalData.id, fixedLayerDataString);
          let layer_data = JSON.parse(
            fixedLayerDataString && fixedLayerDataString.length
              ? fixedLayerDataString
              : "{}"
          );
          layer_data.legacy = true;
          nestedSql += `SELECT ${originalData.id} as id, '${JSON.stringify(
            layer_data
          )}' as layer_data `;
        }

        sql += `${nestedSql}) a on u.id = a.id SET u.layer_data = a.layer_data;`;
        await knex.raw(sql);
      }
    });
};

exports.down = function (knex) {};
