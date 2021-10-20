exports.up = async function (knex) {
  const BATCH_SIZE = 3000;
  return knex("builder_layers")
    .select("id")
    .select("layer_data")
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

          let fixedLayerDataString = unescape(
            escape(
              originalData.layer_data
                .replace("	", "")
                .replace("\\", "")
                .replace("\n", " ")
                .replace("", "->")
                .replace("", "->")
                .toString("utf-8")
            )
          );
          console.log(originalData.id, fixedLayerDataString);
          let layer_data = JSON.parse(
            fixedLayerDataString && fixedLayerDataString.length
              ? fixedLayerDataString
              : "{}"
          );
          if (layer_data.left) layer_data.left = parseFloat(layer_data.left);
          if (layer_data.top) layer_data.top = parseFloat(layer_data.top);
          if (layer_data.width) layer_data.width = parseFloat(layer_data.width);
          if (layer_data.height)
            layer_data.height = parseFloat(layer_data.height);
          if (layer_data.stroke)
            layer_data.stroke = parseFloat(layer_data.stroke);
          if (layer_data.font) layer_data.font = parseFloat(layer_data.font);
          if (layer_data.size) layer_data.size = parseFloat(layer_data.size);
          if (layer_data.rotation)
            layer_data.rotation = parseFloat(layer_data.rotation);
          if (
            layer_data.color &&
            layer_data.color[0] !== "#" &&
            layer_data.color.length === 6
          )
            layer_data.color = "#" + layer_data.color;
          if (
            layer_data.scolor &&
            layer_data.scolor[0] !== "#" &&
            layer_data.scolor.length === 6
          )
            layer_data.scolor = "#" + layer_data.scolor;
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
