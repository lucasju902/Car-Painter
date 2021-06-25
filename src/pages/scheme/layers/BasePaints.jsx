import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import { basePaintAssetURL, legacyBasePaintAssetURL } from "helper";

const BasePaints = (props) => {
  const {
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
        ["layer_order", "desc"]
      ),
    [layers]
  );
  const getLayerImage = useCallback(
    (layer) => {
      return legacyMode
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
          src={getLayerImage(layer)}
          opacity={layer.layer_data.opacity}
          filterColor={layer.layer_data.color}
          listening={false}
          visible={layer.layer_visible ? true : false}
          loadedStatus={loadedStatuses[layer.id]}
          tellSize={handleImageSize}
          onLoadLayer={onLoadLayer}
        />
      ))}
    </>
  );
};

export default React.memo(BasePaints);
