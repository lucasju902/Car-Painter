import React, { useRef, useState, useEffect, useCallback } from "react";

import { Text } from "react-konva";
import { mathRound2 } from "helper";
import { PaintingGuides } from "constant";
import { useDragMove } from "hooks";

export const TextNode = ({
  id,
  stageRef,
  frameSize,
  fontFamily,
  fontFile,
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
  const [handleDragMove, handleExtraDragEnd] = useDragMove(
    stageRef,
    shapeRef,
    guideData,
    frameSize
  );

  useEffect(() => {
    if (fontFamily && fontFile) {
      if (!loadedFontList.includes(fontFamily)) {
        loadFont();
      } else {
        setLoadedFontFamily(fontFamily);
        if (onLoadLayer && id) onLoadLayer(id, true);
      }
    }
  }, [fontFamily, fontFile]);

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

  const handleDragStart = useCallback(
    (e) => {
      onSelect();
      if (onDragStart) onDragStart();
    },
    [onSelect, onDragStart]
  );

  const handleDragEnd = useCallback(
    (e) => {
      handleExtraDragEnd();
      if (onChange) {
        const node = shapeRef.current;
        onChange({
          left: mathRound2(e.target.x()),
          top: mathRound2(e.target.y()),
          width: mathRound2(Math.max(5, node.width())),
          height: mathRound2(Math.max(5, node.height())),
        });
      }
      if (onDragEnd) onDragEnd();
    },
    [onChange, onDragEnd, handleExtraDragEnd]
  );

  const handleTransformStart = useCallback(
    (e) => {
      if (onDragStart) onDragStart();
    },
    [onDragStart]
  );
  const handleTransformEnd = useCallback(
    (e) => {
      if (onChange) {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        onChange({
          left: mathRound2(node.x()),
          top: mathRound2(node.y()),
          // set minimal value
          width: mathRound2(Math.max(5, node.width())),
          height: mathRound2(Math.max(5, node.height())),
          rotation: mathRound2(node.rotation()) || 0,
          scaleX: mathRound2(Math.max(0.01, scaleX)),
          scaleY: mathRound2(Math.max(0.01, scaleY)),
          flop: scaleX > 0 ? 0 : 1,
          flip: scaleY > 0 ? 0 : 1,
        });
      }
      if (onDragEnd) onDragEnd();
    },
    [onChange, onDragEnd]
  );

  return (
    <Text
      {...props}
      fontFamily={loadedFontFamily}
      onClick={onSelect}
      onDblClick={onDblClick}
      onTap={onSelect}
      ref={shapeRef}
      shadowColor={shapeRef.current ? shadowColor : null}
      shadowBlur={shapeRef.current ? shadowBlur : null}
      shadowOpacity={shapeRef.current ? shadowOpacity : null}
      shadowOffsetX={shapeRef.current ? shadowOffsetX : null}
      shadowOffsetY={shapeRef.current ? shadowOffsetY : null}
      draggable={onChange}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onTransformStart={handleTransformStart}
      onTransformEnd={handleTransformEnd}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
      onMouseOver={() => props.listening && onHover && onHover(true)}
      onMouseOut={() => props.listening && onHover && onHover(false)}
    />
  );
};

export default TextNode;
