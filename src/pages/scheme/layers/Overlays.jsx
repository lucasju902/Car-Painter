import React, { useEffect } from "react";

import URLImage from "components/URLImage";
import { LayerTypes } from "../../../constants";
import Helper from "helper";
import config from "config";

const Overlays = (props) => {
  const {
    layers,
    handleImageSize,
    frameSize,
    currentLayer,
    setCurrentLayer,
    onChange,
  } = props;

  useEffect(() => {}, []);

  return (
    <>
      {layers
        .filter(
          (item) => item.layer_type === LayerTypes.OVERLAY && item.layer_visible
        )
        .sort((a, b) => Helper.sortBy(a, b, "layer_order"))
        .map((layer) => (
          <URLImage
            src={`${config.assetsURL}/${layer.layer_data.source_file}`}
            tellSize={handleImageSize}
            key={layer.id}
            x={parseFloat(layer.layer_data.left)}
            y={parseFloat(layer.layer_data.top)}
            width={layer.layer_data.width}
            height={layer.layer_data.height}
            rotation={layer.layer_data.rotation}
            scaleX={layer.layer_data.flop === 0 ? 1 : -1}
            scaleY={layer.layer_data.flip === 0 ? 1 : -1}
            onSelect={() => setCurrentLayer(layer)}
            isSelected={currentLayer && currentLayer.id === layer.id}
            listening={!layer.layer_locked}
            onChange={(values) => onChange(layer, values)}
          />
        ))}
    </>
  );
};

export default Overlays;
