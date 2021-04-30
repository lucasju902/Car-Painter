import React, { useRef } from "react";
import _ from "lodash";
import { Rect, Circle, Ellipse, Star } from "react-konva";
import { mathRound2 } from "helper";

import { MouseModes, AllowedLayerProps, LayerTypes } from "constant";

const Shape = ({
  type,
  x,
  y,
  width,
  height,
  radius,
  innerRadius,
  outerRadius,
  cornerRadius,
  numPoints,
  onSelect,
  onChange,
  shadowColor,
  shadowBlur,
  shadowOpacity,
  shadowOffsetX,
  shadowOffsetY,
  ...props
}) => {
  const shapeRef = useRef();

  const handleDragStart = (e) => {
    onSelect();
  };
  const handleDragEnd = (e) => {
    if (onChange) {
      onChange({
        left: mathRound2(e.target.x()),
        top: mathRound2(e.target.y()),
      });
    }
  };
  const handleTransformEnd = (e) => {
    if (onChange) {
      const AllowedLayerTypes = AllowedLayerProps[LayerTypes.SHAPE][type];
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const width = type !== MouseModes.ELLIPSE ? node.width() : node.radiusX();
      const height =
        type !== MouseModes.ELLIPSE ? node.height() : node.radiusY();

      // we will reset it back
      node.scaleX(scaleX > 0 ? 1 : -1);
      node.scaleY(scaleY > 0 ? 1 : -1);

      onChange(
        _.pick(
          {
            left: mathRound2(node.x()),
            top: mathRound2(node.y()),
            width: mathRound2(Math.max(1, width * Math.abs(scaleX))),
            height: mathRound2(Math.max(1, height * Math.abs(scaleY))),
            radius: node.radius
              ? mathRound2(Math.max(1, node.radius() * Math.abs(scaleY)))
              : 0,
            innerRadius: node.innerRadius
              ? mathRound2(Math.max(1, node.innerRadius() * Math.abs(scaleY)))
              : 0,
            outerRadius: node.outerRadius
              ? mathRound2(Math.max(1, node.outerRadius() * Math.abs(scaleY)))
              : 0,
            rotation: mathRound2(node.rotation()) || 0,
            flop: scaleX > 0 ? 0 : 1,
            flip: scaleY > 0 ? 0 : 1,
          },
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        )
      );
    }
  };

  switch (type) {
    case MouseModes.RECT:
      return (
        <Rect
          {...props}
          ref={shapeRef}
          shadowColor={shapeRef.current ? shadowColor : null}
          shadowBlur={shapeRef.current ? shadowBlur : null}
          shadowOpacity={shapeRef.current ? shadowOpacity : null}
          shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
          shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
          cornerRadius={cornerRadius}
          x={x}
          y={y}
          width={width}
          height={height}
          draggable={onChange}
          onClick={onSelect}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      );
    case MouseModes.CIRCLE:
      return (
        <Circle
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          radius={radius}
          shadowColor={shapeRef.current ? shadowColor : null}
          shadowBlur={shapeRef.current ? shadowBlur : null}
          shadowOpacity={shapeRef.current ? shadowOpacity : null}
          shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
          shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
          draggable={onChange}
          onClick={onSelect}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      );
    case MouseModes.ELLIPSE:
      return (
        <Ellipse
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          radiusX={width}
          radiusY={height}
          shadowColor={shapeRef.current ? shadowColor : null}
          shadowBlur={shapeRef.current ? shadowBlur : null}
          shadowOpacity={shapeRef.current ? shadowOpacity : null}
          shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
          shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
          draggable={onChange}
          onClick={onSelect}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      );
    case MouseModes.STAR:
      return (
        <Star
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          numPoints={numPoints}
          shadowColor={shapeRef.current ? shadowColor : null}
          shadowBlur={shapeRef.current ? shadowBlur : null}
          shadowOpacity={shapeRef.current ? shadowOpacity : null}
          shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
          shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
          draggable={onChange}
          onClick={onSelect}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
      );
    default:
      return <></>;
  }
};

export default Shape;
