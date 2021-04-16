import React from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import config from "config";

const Overlays = (props) => {
  const { layers, currentLayer, setCurrentLayer, frameSize, onChange } = props;

  return (
    <>
      {_.orderBy(
        layers.filter(
          (item) => item.layer_type === LayerTypes.OVERLAY && item.layer_visible
        ),
        ["layer_order"],
        ["desc"]
      ).map((layer) => (
        <URLImage
          name={layer.id.toString()}
          src={`${config.assetsURL}/${layer.layer_data.source_file}`}
          key={layer.id}
          x={parseFloat(layer.layer_data.left || 0)}
          y={parseFloat(layer.layer_data.top || 0)}
          allowFit={true}
          filterColor={layer.layer_data.color}
          width={layer.layer_data.width}
          height={layer.layer_data.height}
          rotation={layer.layer_data.rotation}
          opacity={layer.layer_data.opacity}
          scaleX={layer.layer_data.flop === 1 ? -1 : 1}
          scaleY={layer.layer_data.flip === 1 ? -1 : 1}
          shadowColor={layer.layer_data.shadowColor}
          shadowBlur={layer.layer_data.shadowBlur}
          shadowOpacity={layer.layer_data.shadowOpacity}
          shadowOffsetX={layer.layer_data.shadowOffsetX}
          shadowOffsetY={layer.layer_data.shadowOffsetY}
          onSelect={() => setCurrentLayer(layer)}
          isSelected={currentLayer && currentLayer.id === layer.id}
          listening={!layer.layer_locked}
          frameSize={frameSize}
          onChange={(values) => onChange(layer, values)}
        />
      ))}
    </>
  );
};

export default Overlays;
