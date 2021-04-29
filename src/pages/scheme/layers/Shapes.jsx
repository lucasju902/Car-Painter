import React from "react";
import _ from "lodash";

import Shape from "components/Shape";
import { LayerTypes, MouseModes } from "constant";
import { getRelativeShadowOffset } from "helper";

const Shapes = (props) => {
  const {
    layers,
    drawingLayer,
    setCurrentLayer,
    boardRotate,
    mouseMode,
    onChange,
  } = props;

  return (
    <>
      {_.orderBy(
        layers.filter(
          (item) => item.layer_type === LayerTypes.SHAPE && item.layer_visible
        ),
        ["layer_order"],
        ["desc"]
      ).map((layer) => {
        let shadowOffset = getRelativeShadowOffset(boardRotate, {
          x: layer.layer_data.shadowOffsetX,
          y: layer.layer_data.shadowOffsetY,
        });

        return (
          <Shape
            type={layer.layer_data.type}
            x={parseFloat(layer.layer_data.left || 0)}
            y={parseFloat(layer.layer_data.top || 0)}
            width={layer.layer_data.width}
            height={layer.layer_data.height}
            radius={layer.layer_data.radius}
            cornerRadius={[
              layer.layer_data.cornerTopLeft,
              layer.layer_data.cornerTopRight,
              layer.layer_data.cornerBottomLeft,
              layer.layer_data.cornerBottomRight,
            ]}
            rotation={layer.layer_data.rotation}
            opacity={layer.layer_data.opacity}
            scaleX={layer.layer_data.flop === 1 ? -1 : 1}
            scaleY={layer.layer_data.flip === 1 ? -1 : 1}
            shadowColor={layer.layer_data.shadowColor}
            shadowBlur={layer.layer_data.shadowBlur}
            shadowOpacity={layer.layer_data.shadowOpacity}
            shadowOffsetX={shadowOffset.x}
            shadowOffsetY={shadowOffset.y}
            fill={layer.layer_data.color}
            strokeWidth={layer.layer_data.stroke}
            stroke={layer.layer_data.scolor}
            strokeEnabled={true}
            name={layer.id.toString()}
            key={layer.id}
            onSelect={() => setCurrentLayer(layer)}
            listening={!layer.layer_locked && mouseMode === MouseModes.DEFAULT}
            onChange={(values) => onChange(layer, values)}
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
          radius={drawingLayer.layer_data.radius}
          fill={drawingLayer.layer_data.color}
          strokeWidth={drawingLayer.layer_data.stroke}
          stroke={drawingLayer.layer_data.scolor}
          strokeEnabled={true}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Shapes;
