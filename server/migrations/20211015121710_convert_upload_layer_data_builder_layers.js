exports.up = function (knex) {
  const BATCH_SIZE = 3000;
  return knex("builder_layers")
    .select("builder_layers.id")
    .select("upload_id")
    .select("layer_data")
    .select("file_name")
    .leftJoin(
      "builder_uploads",
      "builder_layers.upload_id",
      "builder_uploads.id"
    )
    .where("layer_type", "=", 5)
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
          let layer_data = JSON.parse(
            originalData.layer_data && originalData.layer_data.length
              ? originalData.layer_data.toString("utf-8")
              : "{}"
          );

          console.log(originalData.id, layer_data);
          if (originalData.file_name) {
            layer_data.id = parseInt(layer_data.upload);
            layer_data.source_file = originalData.file_name;
            layer_data.preview_file = originalData.file_name;
          }

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
