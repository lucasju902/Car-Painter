import React, { useMemo } from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import config from "config";

const CarParts = (props) => {
  const { layers, currentCarMake, handleImageSize } = props;

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter(
          (item) => item.layer_type === LayerTypes.CAR && item.layer_visible
        ),
        ["layer_order"],
        ["desc"]
      ),
    [layers]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          src={
            config.assetsURL +
            "/templates/" +
            currentCarMake.folder_directory.replace(" ", "_") +
            `/${layer.layer_data.img}`
          }
          tellSize={handleImageSize}
          filterColor={layer.layer_data.color}
          key={layer.id}
          listening={false}
        />
      ))}
    </>
  );
};

export default React.memo(CarParts);
