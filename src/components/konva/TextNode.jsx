import React, { useRef, useState, useEffect, useCallback } from "react";

import { Text } from "react-konva";
import { useDrag, useTransform } from "hooks";

export const TextNode = ({
  id,
  stageRef,
  frameSize,
  fontFamily,
  fontFile,
  layer,
  loadedFontList,
  loadedList,
  shadowColor,
  shadowBlur,
  shadowOpacity,
  shadowOffsetX,
  shadowOffsetY,
  paintingGuides,
  guideData,
  onLoadLayer,
  onSelect,
  onDblClick,
  onChange,
  onFontLoad,
  onHover,
  onDragStart,
  onDragEnd,
  ...props
}) => {
  const [loadedFontFamily, setLoadedFontFamily] = useState(null);
  const shapeRef = useRef();
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
  });

  const loadFont = useCallback(() => {
    let fontObject = new FontFace(fontFamily, fontFile);
    fontObject
      .load()
      .then(function (loaded_face) {
        document.fonts.add(loaded_face);
        onFontLoad(fontFamily);
        setLoadedFontFamily(fontFamily);
        if (onLoadLayer && id) onLoadLayer(id, true);
      })
      .catch(function (error) {
        // error occurred
        console.warn(error, fontFamily);
      });
  }, [id, fontFamily, fontFile, onFontLoad, onLoadLayer, setLoadedFontFamily]);

  useEffect(() => {
    if (fontFamily && fontFile) {
      if (!loadedFontList.includes(fontFamily)) {
        loadFont();
      } else {
        setLoadedFontFamily(fontFamily);
        if (onLoadLayer && id) onLoadLayer(id, true);
      }
    }
  }, [fontFamily, fontFile, id, loadFont, loadedFontList, onLoadLayer]);

  return (
    <Text
      {...props}
      fontFamily={loadedFontFamily}
      ref={shapeRef}
      shadowColor={shapeRef.current ? shadowColor : null}
      shadowBlur={shapeRef.current ? shadowBlur : null}
      shadowOpacity={shapeRef.current ? shadowOpacity : null}
      shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
      shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
      draggable={onChange}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
      onClick={onSelect}
      onDblClick={onDblClick}
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

export default TextNode;
