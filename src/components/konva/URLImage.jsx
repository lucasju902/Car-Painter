import React, { useRef, useMemo } from "react";
import { Image } from "react-konva";
import Konva from "konva";
import { hexToRgba } from "helper";
import { useDrag, useTransform, useKonvaImageInit } from "hooks";

export const URLImage = ({
  id,
  src,
  stageRef,
  filterColor,
  frameSize,
  allowFit,
  layer,
  loadedStatus,
  boardRotate = 0,
  onLoadLayer,
  tellSize,
  stroke,
  strokeWidth,
  strokeScale,
  shadowBlur,
  shadowColor,
  shadowOffsetX,
  shadowOffsetY,
  paintingGuides,
  guideData,
  onSelect,
  onDblClick,
  onChange,
  onHover,
  onDragStart,
  onDragEnd,
  ...props
}) => {
  const shapeRef = useRef();

  const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);
  const allowFilter = useMemo(
    () => !isSVG && filterColor && filterColor.length,
    [filterColor, isSVG]
  );
  const filters = useMemo(() => (allowFilter ? [Konva.Filters.RGBA] : []), [
    allowFilter,
  ]);

  const [image, , applyCaching] = useKonvaImageInit({
    imageshapeRef: shapeRef,
    id,
    src,
    stroke,
    strokeWidth,
    filterColor,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    strokeScale,
    allowFit,
    frameSize,
    loadedStatus,
    boardRotate,
    width: props.width,
    height: props.height,
    x: props.x,
    y: props.y,
    onChange,
    tellSize,
    onLoadLayer,
  });

  const [handleDragStart, handleDragMove, handleDragEnd] = useDrag({
    stageRef,
    shapeRef,
    paintingGuides,
    guideData,
    frameSize,
    onSelect,
    onChange,
    onDragStart,
    onDragEnd,
  });
  const [handleTransformStart, handleTransformEnd] = useTransform({
    shapeRef,
    layer,
    onChange,
    onDragStart,
    onDragEnd,
    applyCaching,
  });

  return (
    <Image
      {...props}
      image={image}
      ref={shapeRef}
      draggable={onChange}
      shadowBlur={shadowBlur}
      shadowColor={shadowColor}
      shadowOffsetX={shadowOffsetX || 0}
      shadowOffsetY={shadowOffsetY || 0}
      red={allowFilter ? hexToRgba(filterColor).r : null}
      green={allowFilter ? hexToRgba(filterColor).g : null}
      blue={allowFilter ? hexToRgba(filterColor).b : null}
      alpha={allowFilter ? hexToRgba(filterColor).a / 255 : null}
      filters={allowFilter ? filters : null}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
      onDblClick={onDblClick}
      onClick={onSelect}
      onTap={onSelect}
      onMouseOver={() => props.listening && onHover && onHover(true)}
      onMouseOut={() => props.listening && onHover && onHover(false)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onTransformStart={handleTransformStart}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default URLImage;
