import React, { useRef, useEffect } from "react";
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
import { MouseModes } from "constant";
import { useDrag, useTransform } from "hooks";

export const Shape = ({
  id,
  type,
  editable,
  stageRef,
  frameSize,
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
  shadowColor,
  shadowBlur,
  shadowOpacity,
  shadowOffsetX,
  shadowOffsetY,
  layer,
  paintingGuides,
  guideData,
  onSelect,
  onDblClick,
  onChange,
  onHover,
  onDragStart,
  onDragEnd,
  onLoadLayer,
  ...props
}) => {
  const shapeRef = useRef();

  const [, handleDragStart, handleDragMove, handleDragEnd] = useDrag({
    stageRef,
    shapeRef,
    paintingGuides,
    guideData,
    frameSize,
    offsetsFromStroke,
    opacity: layer.layer_data.opacity,
    onSelect,
    onChange,
    onDragStart,
    onDragEnd,
  });

  const [
    ,
    handleTransformStart,
    handleTransformEnd,
    handleTransform,
  ] = useTransform({
    shapeRef,
    offsetsFromStroke,
    layer,
    frameSize,
    onChange,
    onDragStart,
    onDragEnd,
  });

  useEffect(() => {
    if (onLoadLayer && id) onLoadLayer(id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          closed={true}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
          draggable={onChange && editable}
          onClick={onSelect}
          onDblClick={onDblClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          onTransform={handleTransform}
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
