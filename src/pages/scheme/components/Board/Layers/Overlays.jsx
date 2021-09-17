import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import config from "config";
import { FinishOptions, LayerTypes, MouseModes } from "constant";
import { getRelativeShadowOffset } from "helper";

import { GroupedURLImage } from "components/konva";

export const Overlays = React.memo((props) => {
  const {
    layers,
    editable,
    setCurrentLayer,
    frameSize,
    mouseMode,
    specMode,
    boardRotate,
    loadedStatuses,
    onChange,
    onHover,
    onLoadLayer,
    onDragStart,
    onDragEnd,
    onDblClick,
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
          <GroupedURLImage
            key={layer.id}
            id={layer.id}
            editable={editable}
            name={layer.id.toString()}
            src={`${config.assetsURL}/${layer.layer_data.source_file}`}
            x={parseFloat(layer.layer_data.left || 0)}
            y={parseFloat(layer.layer_data.top || 0)}
            allowFit={true}
            filterColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.color
            }
            width={layer.layer_data.width}
            height={layer.layer_data.height}
            rotation={layer.layer_data.rotation}
            boardRotate={boardRotate}
            loadedStatus={loadedStatuses[layer.id]}
            opacity={layer.layer_data.opacity}
            scaleX={layer.layer_data.flop === 1 ? -1 : 1}
            scaleY={layer.layer_data.flip === 1 ? -1 : 1}
            skewX={
              Math.abs(layer.layer_data.skewX) >= 1
                ? layer.layer_data.skewX / 10
                : layer.layer_data.skewX
            }
            skewY={
              Math.abs(layer.layer_data.skewY) >= 1
                ? layer.layer_data.skewY / 10
                : layer.layer_data.skewY
            }
            bgColor={specMode ? null : layer.layer_data.bgColor}
            paddingX={layer.layer_data.paddingX}
            paddingY={layer.layer_data.paddingY}
            shadowColor={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.shadowColor
            }
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            strokeWidth={layer.layer_data.stroke}
            stroke={
              specMode
                ? layer.layer_data.finish || FinishOptions[0].value
                : layer.layer_data.scolor
            }
            onSelect={() => setCurrentLayer(layer)}
            onDblClick={onDblClick}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            frameSize={frameSize}
            layer_data={layer.layer_data}
            onChange={(values) => onChange(layer, values)}
            onHover={(flag) => onHover(layer, flag)}
            visible={layer.layer_visible ? true : false}
            onLoadLayer={onLoadLayer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      })}
    </>
  );
});

export default Overlays;
