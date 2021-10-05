import React, { useRef, useMemo } from "react";
import { Image, Group, Rect } from "react-konva";
import Konva from "konva";
import { hexToRgba } from "helper";
import { useDrag, useTransform, useKonvaImageInit } from "hooks";

export const GroupedURLImage = ({
  id,
  src,
  editable,
  stageRef,
  bgColor = null,
  paddingX = 0,
  paddingY = 0,
  filterColor,
  frameSize,
  allowFit,
  layer,
  loadedStatus,
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
  const imageshapeRef = useRef();

  const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);
  const allowFilter = useMemo(
    () => !isSVG && filterColor && filterColor.length,
    [filterColor, isSVG]
  );
  const filters = useMemo(() => (allowFilter ? [Konva.Filters.RGBA] : []), [
    allowFilter,
  ]);

  const [image, , applyCaching] = useKonvaImageInit({
    imageshapeRef,
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
    width: props.width,
    height: props.height,
    defaultWidth: layer.layer_data.default_width,
    defaultHeight: layer.layer_data.default_height,
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
    imageshapeRef,
    onChange,
    onDragStart,
    onDragEnd,
    applyCaching,
  });

  return (
    <Group
      {...props}
      name={id ? id.toString() : null}
      ref={shapeRef}
      onClick={onSelect}
      onDblClick={onDblClick}
      onTap={onSelect}
      draggable={onChange && editable}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onTransformStart={handleTransformStart}
      onTransformEnd={handleTransformEnd}
      onMouseOver={() => props.listening && onHover && onHover(true)}
      onMouseOut={() => props.listening && onHover && onHover(false)}
    >
      {bgColor ? (
        <Rect
          x={-paddingX || 0}
          y={-paddingY || 0}
          width={props.width + 2 * (paddingX || 0)}
          height={props.height + 2 * (paddingY || 0)}
          fill={bgColor}
        />
      ) : (
        <></>
      )}

      <Image
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        shadowBlur={shadowBlur}
        shadowColor={shadowColor}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        red={allowFilter ? hexToRgba(filterColor).r : null}
        green={allowFilter ? hexToRgba(filterColor).g : null}
        blue={allowFilter ? hexToRgba(filterColor).b : null}
        alpha={allowFilter ? hexToRgba(filterColor).a / 255 : null}
        filters={allowFilter ? filters : null}
        image={image}
        ref={imageshapeRef}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />
    </Group>
  );
};

export default GroupedURLImage;
