import React from "react";
import _ from "lodash";

import URLImage from "components/URLImage";
import { LayerTypes, MouseModes } from "constant";
import config from "config";
import { getRelativeShadowOffset } from "helper";

const Overlays = (props) => {
  const {
    layers,
    setCurrentLayer,
    frameSize,
    mouseMode,
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
        let shadowOffset = getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        });

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
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            onSelect={() => setCurrentLayer(layer)}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            frameSize={frameSize}
            onChange={(values) => onChange(layer, values)}
          />
        );
      })}
    </>
  );
};

export default Overlays;
