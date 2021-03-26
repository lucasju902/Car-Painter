import React from "react";

import URLImage from "components/URLImage";
import { LayerTypes } from "../../../constants";
import Helper from "helper";
import config from "config";

const BasePaints = (props) => {
  const { layers, handleImageSize } = props;

  return (
    <>
      {layers
        .filter(
          (item) => item.layer_type === LayerTypes.BASE && item.layer_visible
        )
        .sort((a, b) => Helper.sortBy(a, b, "layer_order"))
        .map((layer) => (
          <URLImage
            src={`${config.assetsURL}/bases/${layer.layer_data.id}/${layer.layer_data.img}`}
            tellSize={handleImageSize}
            key={layer.id}
            listening={false}
          />
        ))}
    </>
  );
};

export default BasePaints;
