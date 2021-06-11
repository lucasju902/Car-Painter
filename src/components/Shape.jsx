import React, { useRef, useEffect } from "react";
import _ from "lodash";
import {
  Rect,
  Circle,
  Ellipse,
  Star,
  Ring,
  RegularPolygon,
  Wedge,
  Arc,
  Line,
  Arrow,
} from "react-konva";
import { mathRound2 } from "helper";

import { MouseModes, AllowedLayerProps, LayerTypes } from "constant";

const Shape = ({
  id,
  type,
  x,
  y,
  width,
  height,
  radius,
  points,
  lineCap,
  lineJoin,
  offsetsFromStroke,
  pointerLength,
  pointerWidth,
  innerRadius,
  outerRadius,
  cornerRadius,
  numPoints,
  angle,
  onSelect,
  onChange,
  onHover,
  shadowColor,
  shadowBlur,
  shadowOpacity,
  shadowOffsetX,
  shadowOffsetY,
  layer_data,
  onLoadLayer,
  ...props
}) => {
  const shapeRef = useRef();
  const handleDragStart = (e) => {
    onSelect();
  };
  const handleDragEnd = (e) => {
    if (onChange) {
      const AllowedLayerTypes = AllowedLayerProps[LayerTypes.SHAPE][type];
      onChange(
        _.pick(
          {
            left: mathRound2(e.target.x() - offsetsFromStroke.x),
            top: mathRound2(e.target.y() - offsetsFromStroke.y),
          },
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        )
      );
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
      const xyScale = Math.abs(
        Math.abs(mathRound2(scaleY)) !== 1 ? scaleY : scaleX
      );

      // we will reset it back
      node.scaleX(scaleX > 0 ? 1 : -1);
      node.scaleY(scaleY > 0 ? 1 : -1);

      onChange(
        _.pick(
          {
            left: mathRound2(node.x() - offsetsFromStroke.x),
            top: mathRound2(node.y() - offsetsFromStroke.y),
            width: mathRound2(
              Math.max(1, width * Math.abs(scaleX)) - offsetsFromStroke.width
            ),
            height: mathRound2(
              Math.max(1, height * Math.abs(scaleY)) - offsetsFromStroke.height
            ),
            radius: node.radius
              ? mathRound2(
                  Math.max(1, node.radius() * Math.abs(scaleY)) -
                    offsetsFromStroke.radius
                )
              : 0,
            innerRadius: node.innerRadius
              ? mathRound2(
                  Math.max(1, node.innerRadius() * Math.abs(scaleY)) -
                    offsetsFromStroke.innerRadius
                )
              : 0,
            outerRadius: node.outerRadius
              ? mathRound2(
                  Math.max(1, node.outerRadius() * Math.abs(scaleY)) -
                    offsetsFromStroke.outerRadius
                )
              : 0,
            rotation: mathRound2(node.rotation()) || 0,
            flop: scaleX > 0 ? 0 : 1,
            flip: scaleY > 0 ? 0 : 1,
            stroke: mathRound2(node.strokeWidth() * xyScale),
            shadowBlur: mathRound2(node.shadowBlur() * xyScale),
            shadowOffsetX: mathRound2(
              layer_data.shadowOffsetX * Math.abs(scaleX)
            ),
            shadowOffsetY: mathRound2(
              layer_data.shadowOffsetY * Math.abs(scaleY)
            ),
            cornerTopLeft: mathRound2(layer_data.cornerTopLeft * xyScale),
            cornerTopRight: mathRound2(layer_data.cornerTopRight * xyScale),
            cornerBottomLeft: mathRound2(layer_data.cornerBottomLeft * xyScale),
            cornerBottomRight: mathRound2(
              layer_data.cornerBottomRight * xyScale
            ),
            points: points.map((point, index) =>
              index % 2 === 0
                ? mathRound2(point * Math.abs(scaleX))
                : mathRound2(point * Math.abs(scaleY))
            ),
          },
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        )
      );
    }
  };
  useEffect(() => {
    if (onLoadLayer && id) onLoadLayer(id, true);
  }, []);
  return (
    <>
      {type === MouseModes.RECT ? (
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.CIRCLE ? (
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.ELLIPSE ? (
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.STAR ? (
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.RING ? (
        <Ring
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.REGULARPOLYGON ? (
        <RegularPolygon
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          radius={radius}
          sides={numPoints}
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.WEDGE ? (
        <Wedge
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          radius={radius}
          angle={angle}
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.ARC ? (
        <Arc
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          angle={angle}
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
          shadowForStrokeEnabled={false}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.LINE || type === MouseModes.PEN ? (
        <Line
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          points={points}
          lineCap={lineCap}
          lineJoin={lineJoin}
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
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.POLYGON ? (
        <Line
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          points={points}
          lineCap={lineCap}
          lineJoin={lineJoin}
          shadowColor={shapeRef.current ? shadowColor : null}
          shadowBlur={shapeRef.current ? shadowBlur : null}
          shadowOpacity={shapeRef.current ? shadowOpacity : null}
          shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
          shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
          draggable={onChange}
          closed={true}
          onClick={onSelect}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : type === MouseModes.ARROW ? (
        <Arrow
          {...props}
          ref={shapeRef}
          x={x}
          y={y}
          points={points}
          lineCap={lineCap}
          lineJoin={lineJoin}
          pointerLength={pointerLength}
          pointerWidth={pointerWidth}
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
          onMouseOver={() => props.listening && onHover && onHover(true)}
          onMouseOut={() => props.listening && onHover && onHover(false)}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Shape;
