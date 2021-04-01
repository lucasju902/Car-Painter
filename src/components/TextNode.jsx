import React, { useRef, useState, useEffect } from "react";

import { Text } from "react-konva";

const TextNode = ({
  fontFamily,
  fontFile,
  loadedFontList,
  loadedList,
  isSelected,
  onSelect,
  onChange,
  onFontLoad,
  ...props
}) => {
  const [loadedFontFamily, setLoadedFontFamily] = useState(null);
  const shapeRef = useRef();

  useEffect(() => {
    if (fontFamily && fontFile && !loadedFontList.includes(fontFamily)) {
      loadFont();
    }
  }, [fontFamily, fontFile]);

  const loadFont = () => {
    let fontObject = new FontFace(fontFamily, fontFile);
    fontObject
      .load()
      .then(function (loaded_face) {
        document.fonts.add(loaded_face);
        onFontLoad(fontFamily);
        setLoadedFontFamily(fontFamily);
      })
      .catch(function (error) {
        // error occurred
        console.warn(error, fontFamily);
      });
  };

  const handleDragStart = (e) => {
    onSelect();
  };
  const handleDragEnd = (e) => {
    if (onChange) {
      onChange({
        left: e.target.x(),
        top: e.target.y(),
      });
    }
  };
  const handleTransformEnd = (e) => {
    if (onChange) {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      console.log("scaleX, scaleY: ", scaleX, scaleY);
      // we will reset it back
      onChange({
        left: node.x(),
        top: node.y(),
        // set minimal value
        width: Math.max(5, node.width()),
        height: Math.max(5, node.height()),
        rotation: node.rotation(),
        scaleX: Math.abs(scaleX),
        scaleY: Math.abs(scaleY),
        flop: scaleX > 0 ? 0 : 1,
        flip: scaleY > 0 ? 0 : 1,
      });
    }
  };

  return (
    <Text
      {...props}
      fontFamily={loadedFontFamily}
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      draggable={onChange}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default TextNode;
