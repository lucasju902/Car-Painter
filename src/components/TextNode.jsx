import React, { useRef, useState, useEffect } from "react";

import { Text } from "react-konva";
import Helper from "helper";

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
    if (fontFamily && fontFile) {
      if (!loadedFontList.includes(fontFamily)) {
        loadFont();
      } else {
        setLoadedFontFamily(fontFamily);
      }
    }
  }, [fontFamily, fontFile]);

  useEffect(() => {
    const node = shapeRef.current;
    if (
      node &&
      (node.width() !== props.width || node.height() !== props.height) &&
      loadedFontFamily
    ) {
      if (onChange) {
        onChange({
          width: Helper.mathRound2(node.width()),
          height: Helper.mathRound2(node.height()),
        });
      }
    }
  }, [shapeRef.current]);

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
        left: Helper.mathRound2(e.target.x()),
        top: Helper.mathRound2(e.target.y()),
      });
    }
  };
  const handleTransform = (e) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = node.width();
    const height = node.height();
    // we will reset it back
    node.width(Helper.mathRound2(Math.max(5, width * Math.abs(scaleX))));
    node.height(Helper.mathRound2(Math.max(5, height * Math.abs(scaleY))));
    node.scaleX(scaleX > 0 ? 1 : -1);
    node.scaleY(scaleY > 0 ? 1 : -1);
  };
  const handleTransformEnd = (e) => {
    if (onChange) {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      onChange({
        left: Helper.mathRound2(node.x()),
        top: Helper.mathRound2(node.y()),
        // set minimal value
        width: Helper.mathRound2(Math.max(5, node.width())),
        height: Helper.mathRound2(Math.max(5, node.height())),
        rotation: Helper.mathRound2(node.rotation()),
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
      onTransform={handleTransform}
    />
  );
};

export default TextNode;
