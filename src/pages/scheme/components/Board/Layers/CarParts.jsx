import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import { FinishOptions, LayerTypes } from "constant";
import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";
import config from "config";

import { URLImage } from "components/konva";

export const CarParts = React.memo((props) => {
  const {
    layers,
    legacyMode,
    specMode,
    carMake,
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
  const getCarMakeImage = useCallback(
    (layer_data) => {
      return layer_data.legacy
        ? `${
            config.legacyAssetURL
          }/templates/${carMake.folder_directory.replace(" ", "_")}/`
        : (legacyMode
            ? legacyCarMakeAssetURL(carMake)
            : carMakeAssetURL(carMake)) + layer_data.img;
    },
    [legacyMode, carMake]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          name={layer.id.toString()}
          layer={layer}
          x={0}
          y={0}
          width={legacyMode ? 1024 : 2048}
          height={legacyMode ? 1024 : 2048}
          src={getCarMakeImage(layer.layer_data)}
          filterColor={
            specMode
              ? layer.layer_data.finish || FinishOptions[0].value
              : layer.layer_data.color
          }
          listening={false}
          visible={layer.layer_visible ? true : false}
          loadedStatus={loadedStatuses[layer.id]}
          onLoadLayer={onLoadLayer}
          tellSize={handleImageSize}
        />
      ))}
    </>
  );
});

export default CarParts;
