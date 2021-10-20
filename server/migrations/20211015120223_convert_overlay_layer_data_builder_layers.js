exports.up = function (knex) {
  const BATCH_SIZE = 3000;
  return knex("builder_layers")
    .select("id")
    .select("layer_data")
    .where("layer_type", "=", 4)
    .then(async function (res) {
      let overlays = await knex("builder_overlays").select();
      let overlayMap = {};
      for (let lay of overlays) {
        overlayMap[parseInt(lay.id)] = lay;
      }

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
          if (layer_data.overlay) {
            const overlay = overlayMap[parseInt(layer_data.overlay)];
            layer_data.id = overlay.id;
            layer_data.name = overlay.name;
            layer_data.source_file = overlay.overlay_file;
            layer_data.preview_file = overlay.overlay_thumb;
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
