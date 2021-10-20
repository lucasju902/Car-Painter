import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import { FinishOptions, LayerTypes } from "constant";
import { basePaintAssetURL, legacyBasePaintAssetURL } from "helper";

import { URLImage } from "components/konva";
import config from "config";

export const BasePaints = React.memo((props) => {
  const {
    specMode,
    legacyMode,
    layers,
    carMake,
    loadedStatuses,
    handleImageSize,
    onLoadLayer,
  } = props;

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter((item) => item.layer_type === LayerTypes.BASE),
        ["layer_order"],
        ["desc"]
      ),
    [layers]
  );
  const getLayerImage = useCallback(
    (layer) => {
      return layer.layer_data.legacy
        ? `https://www.tradingpaints.com/builder/layers/layer_${layer.id}.png`
        : legacyMode
        ? legacyBasePaintAssetURL(layer.layer_data) + layer.layer_data.img
        : basePaintAssetURL(carMake, layer.layer_data.basePaintIndex) +
          layer.layer_data.img;
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
          src={getLayerImage(layer)}
          x={0}
          y={0}
          opacity={layer.layer_data.opacity}
          filterColor={
            specMode
              ? layer.layer_data.finish || FinishOptions[0].value
              : layer.layer_data.color
          }
          listening={false}
          visible={layer.layer_visible ? true : false}
          loadedStatus={loadedStatuses[layer.id]}
          tellSize={handleImageSize}
          onLoadLayer={onLoadLayer}
        />
      ))}
    </>
  );
});

export default BasePaints;
