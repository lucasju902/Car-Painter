import React, { useMemo } from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import config from "config";

const CarParts = (props) => {
  const {
    layers,
    currentCarMake,
    loadedStatuses,
    handleImageSize,
    onLoadLayer,
  } = props;

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter((item) => item.layer_type === LayerTypes.CAR),
        ["layer_order"],
        ["desc"]
      ),
    [layers]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          src={
            config.assetsURL +
            "/templates/" +
            currentCarMake.folder_directory.replace(" ", "_") +
            `/${layer.layer_data.img}`
          }
          filterColor={layer.layer_data.color}
          listening={false}
          visible={layer.layer_visible ? true : false}
          loadedStatus={loadedStatuses[layer.id]}
          onLoadLayer={onLoadLayer}
          tellSize={handleImageSize}
        />
      ))}
    </>
  );
};

export default React.memo(CarParts);
