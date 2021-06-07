import React, { useMemo } from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import config from "config";

const BasePaints = (props) => {
  const { layers, loadedStatuses, handleImageSize, onLoadLayer } = props;

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter((item) => item.layer_type === LayerTypes.BASE),
        ["layer_order", "desc"]
      ),
    [layers]
  );

  return (
    <>
      {filteredLayers.map((layer) => (
        <URLImage
          key={layer.id}
          id={layer.id}
          src={`${config.assetsURL}/bases/${layer.layer_data.id}/${layer.layer_data.img}`}
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
