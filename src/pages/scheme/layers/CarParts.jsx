import React from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "../../../constants";
import config from "config";

const CarParts = (props) => {
  const { layers, currentCarMake, handleImageSize } = props;

  return (
    <>
      {_.orderBy(
        layers.filter(
          (item) => item.layer_type === LayerTypes.CAR && item.layer_visible
        ),
        ["layer_order"],
        ["desc"]
      ).map((layer) => (
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
