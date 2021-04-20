import React from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes } from "constant";
import config from "config";

const Overlays = (props) => {
  const {
    layers,
    currentLayer,
    setCurrentLayer,
    frameSize,
    boardRotate,
    onChange,
  } = props;

  return (
    <>
      {_.orderBy(
        layers.filter(
          (item) => item.layer_type === LayerTypes.OVERLAY && item.layer_visible
        ),
        ["layer_order"],
        ["desc"]
      ).map((layer) => {
        let shadowOffsetX = layer.layer_data.shadowOffsetX;
        let shadowOffsetY = layer.layer_data.shadowOffsetY;
        if (boardRotate === 90) {
          shadowOffsetX = -layer.layer_data.shadowOffsetY;
          shadowOffsetY = layer.layer_data.shadowOffsetX;
        } else if (boardRotate === 180) {
          shadowOffsetX = -layer.layer_data.shadowOffsetX;
          shadowOffsetY = -layer.layer_data.shadowOffsetY;
        } else if (boardRotate === 270) {
          shadowOffsetX = layer.layer_data.shadowOffsetY;
          shadowOffsetY = -layer.layer_data.shadowOffsetX;
        }

        return (
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
            boardRotate={boardRotate}
            opacity={layer.layer_data.opacity}
            scaleX={layer.layer_data.flop === 1 ? -1 : 1}
            scaleY={layer.layer_data.flip === 1 ? -1 : 1}
            shadowColor={layer.layer_data.shadowColor}
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffsetX}
            shadowOffsetY={shadowOffsetY}
            onSelect={() => setCurrentLayer(layer)}
            isSelected={currentLayer && currentLayer.id === layer.id}
            listening={!layer.layer_locked}
            frameSize={frameSize}
            onChange={(values) => onChange(layer, values)}
          />
        );
      })}
    </>
  );
};

export default Overlays;
