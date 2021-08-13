import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import Shape from "components/Shape";
import { LayerTypes, MouseModes } from "constant";
import { getRelativeShadowOffset, removeDuplicatedPointFromEnd } from "helper";

const Shapes = (props) => {
  const {
    editable,
    layers,
    drawingLayer,
    setCurrentLayer,
    boardRotate,
    mouseMode,
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
        layers.filter((item) => item.layer_type === LayerTypes.SHAPE),
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
  const getOffsetsFromStroke = useCallback((layer) => {
    if (layer.layer_data.strokeType === "inside")
      return {
        x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? layer.layer_data.stroke / 2.0
          : 0,
        y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? layer.layer_data.stroke / 2.0
          : 0,
        height: -layer.layer_data.stroke / 2.0,
        width: -layer.layer_data.stroke / 2.0,
        radius: -layer.layer_data.stroke / 2.0,
        pointerLength: -layer.layer_data.stroke / 2.0,
        pointerWidth: -layer.layer_data.stroke / 2.0,
        innerRadius: layer.layer_data.stroke / 2.0,
        outerRadius: -layer.layer_data.stroke / 2.0,
      };
    if (layer.layer_data.strokeType === "outside")
      return {
        x: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? -layer.layer_data.stroke / 2.0
          : 0,
        y: [MouseModes.RECT, MouseModes.ELLIPSE].includes(layer.layer_type)
          ? -layer.layer_data.stroke / 2.0
          : 0,
        height: layer.layer_data.stroke / 2.0,
        width: layer.layer_data.stroke / 2.0,
        radius: layer.layer_data.stroke / 2.0,
        pointerLength: layer.layer_data.stroke / 2.0,
        pointerWidth: layer.layer_data.stroke / 2.0,
        innerRadius: -layer.layer_data.stroke / 2.0,
        outerRadius: layer.layer_data.stroke / 2.0,
      };
    return {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      radius: 0,
      pointerLength: 0,
      pointerWidth: 0,
      innerRadius: 0,
      outerRadius: 0,
    };
  }, []);

  return (
    <>
      {filteredLayers.map((layer) => {
        let shadowOffset = getShadowOffset(layer);
        let offsetsFromStroke = getOffsetsFromStroke(layer);

        return (
          <Shape
            key={layer.id}
            id={layer.id}
            editable={editable}
            type={layer.layer_data.type}
            x={parseFloat(layer.layer_data.left + offsetsFromStroke.x || 0)}
            y={parseFloat(layer.layer_data.top + offsetsFromStroke.y || 0)}
            width={Math.abs(layer.layer_data.width + offsetsFromStroke.width)}
            height={Math.abs(
              layer.layer_data.height + offsetsFromStroke.height
            )}
            radius={Math.abs(
              layer.layer_data.radius + offsetsFromStroke.radius
            )}
            offsetsFromStroke={offsetsFromStroke}
            points={
              layer.layer_data.points
                ? removeDuplicatedPointFromEnd(layer.layer_data.points)
                : []
            }
            loadedStatus={loadedStatuses[layer.id]}
            pointerLength={Math.abs(
              layer.layer_data.pointerLength + offsetsFromStroke.pointerLength
            )}
            pointerWidth={Math.abs(
              layer.layer_data.pointerWidth + offsetsFromStroke.pointerWidth
            )}
            lineCap={layer.layer_data.lineCap}
            lineJoin={layer.layer_data.lineJoin}
            innerRadius={Math.abs(
              layer.layer_data.innerRadius + offsetsFromStroke.innerRadius
            )}
            outerRadius={Math.abs(
              layer.layer_data.outerRadius + offsetsFromStroke.outerRadius
            )}
            numPoints={layer.layer_data.numPoints}
            cornerRadius={[
              layer.layer_data.cornerTopLeft,
              layer.layer_data.cornerTopRight,
              layer.layer_data.cornerBottomLeft,
              layer.layer_data.cornerBottomRight,
            ]}
            rotation={layer.layer_data.rotation}
            angle={layer.layer_data.angle}
            opacity={layer.layer_data.opacity}
            scaleX={layer.layer_data.flop === 1 ? -1 : 1}
            scaleY={layer.layer_data.flip === 1 ? -1 : 1}
            shadowColor={layer.layer_data.shadowColor}
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            skewX={layer.layer_data.skewX}
            skewY={layer.layer_data.skewY}
            fill={layer.layer_data.color}
            strokeWidth={layer.layer_data.stroke}
            stroke={layer.layer_data.scolor}
            strokeEnabled={true}
            globalCompositeOperation={
              layer.layer_data.blendType === "normal"
                ? null
                : layer.layer_data.blendType
            }
            name={layer.id.toString()}
            visible={layer.layer_visible ? true : false}
            layer_data={layer.layer_data}
            perfectDrawEnabled={false}
            onSelect={() => setCurrentLayer(layer)}
            onDblClick={onDblClick}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            onChange={(values) => onChange(layer, values)}
            onHover={(flag) => onHover(layer, flag)}
            onLoadLayer={onLoadLayer}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      })}
      {drawingLayer ? (
        <Shape
          type={drawingLayer.layer_data.type}
          x={parseFloat(drawingLayer.layer_data.left || 0)}
          y={parseFloat(drawingLayer.layer_data.top || 0)}
          width={drawingLayer.layer_data.width}
          height={drawingLayer.layer_data.height}
          radius={Math.abs(drawingLayer.layer_data.radius)}
          angle={drawingLayer.layer_data.angle}
          points={
            drawingLayer.layer_data.points
              ? removeDuplicatedPointFromEnd(drawingLayer.layer_data.points)
              : []
          }
          pointerLength={drawingLayer.layer_data.pointerLength}
          pointerWidth={drawingLayer.layer_data.pointerWidth}
          lineCap={drawingLayer.layer_data.lineCap}
          lineJoin={drawingLayer.layer_data.lineJoin}
          innerRadius={Math.abs(drawingLayer.layer_data.innerRadius)}
          outerRadius={Math.abs(drawingLayer.layer_data.outerRadius)}
          numPoints={drawingLayer.layer_data.numPoints}
          fill={drawingLayer.layer_data.color}
          strokeWidth={drawingLayer.layer_data.stroke}
          stroke={drawingLayer.layer_data.scolor}
          strokeEnabled={true}
          layer_data={drawingLayer.layer_data}
          perfectDrawEnabled={false}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default React.memo(Shapes);
