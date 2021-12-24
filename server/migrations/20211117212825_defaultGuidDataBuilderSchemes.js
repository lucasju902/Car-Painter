exports.up = function (knex) {
  const defaultGuideData = {
    wireframe_opacity: 0.1,
    show_wireframe: true,
    sponsor_opacity: 0.3,
    show_sponsor: true,
    numberblock_opacity: 0.2,
    show_numberBlocks: true,
    show_number_block_on_top: true,
    show_carparts_on_top: true,
  };

  return knex("builder_schemes")
    .update({
      guide_data: JSON.stringify(defaultGuideData),
    })
    .whereNull("guide_data");
};

exports.down = function (knex) {};
