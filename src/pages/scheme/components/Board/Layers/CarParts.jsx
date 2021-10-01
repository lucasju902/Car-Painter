import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import { FinishOptions, LayerTypes } from "constant";
import { legacyCarMakeAssetURL, carMakeAssetURL } from "helper";

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
    (image) => {
      return (
        (legacyMode
          ? legacyCarMakeAssetURL(carMake)
          : carMakeAssetURL(carMake)) + image
      );
    },
    [legacyMode, carMake]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          layer={layer}
          src={getCarMakeImage(layer.layer_data.img)}
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
