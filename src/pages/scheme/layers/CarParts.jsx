import React from "react";

import URLImage from "components/URLImage";
import { LayerTypes } from "../../../constants";
import Helper from "helper";
import config from "config";

const CarParts = (props) => {
  const { layers, currentCarMake, handleImageSize } = props;

  return (
    <>
      {layers
        .filter(
          (item) => item.layer_type === LayerTypes.CAR && item.layer_visible
        )
        .sort((a, b) => Helper.sortBy(a, b, "layer_order"))
        .map((layer) => (
          <URLImage
            src={
              config.assetsURL +
              "/templates/" +
              currentCarMake.folder_directory.replace(" ", "_") +
              `/${layer.layer_data.img}`
            }
            tellSize={handleImageSize}
            key={layer.id}
            listening={false}
          />
        ))}
    </>
  );
};

export default CarParts;
