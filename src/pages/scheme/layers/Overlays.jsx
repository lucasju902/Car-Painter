import React, { useMemo, useCallback } from "react";
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
    loadedStatuses,
    onChange,
    onHover,
    onLoadLayer,
  } = props;

  const filteredLayers = useMemo(
    () =>
      _.orderBy(
        layers.filter((item) => item.layer_type === LayerTypes.OVERLAY),
        ["layer_order"],
        ["desc"]
      ),
    [layers]
  );
  const getShadowOffset = useCallback(
    (layer) => {
      return getRelativeShadowOffset(boardRotate, {
        x: layer.layer_data.shadowOffsetX,
        y: layer.layer_data.shadowOffsetY,
      });
    },
    [boardRotate]
  );

  return (
    <>
      {filteredLayers.map((layer) => {
        let shadowOffset = getShadowOffset(layer);

        return (
          <URLImage
            key={layer.id}
            id={layer.id}
            name={layer.id.toString()}
            src={`${config.assetsURL}/${layer.layer_data.source_file}`}
            x={parseFloat(layer.layer_data.left || 0)}
            y={parseFloat(layer.layer_data.top || 0)}
            allowFit={true}
            filterColor={layer.layer_data.color}
            width={layer.layer_data.width}
            height={layer.layer_data.height}
            rotation={layer.layer_data.rotation}
            boardRotate={boardRotate}
            loadedStatus={loadedStatuses[layer.id]}
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
            layer_data={layer.layer_data}
            onChange={(values) => onChange(layer, values)}
            onHover={(flag) => onHover(layer, flag)}
            visible={layer.layer_visible ? true : false}
            onLoadLayer={onLoadLayer}
          />
        );
      })}
    </>
  );
};

export default React.memo(Overlays);
