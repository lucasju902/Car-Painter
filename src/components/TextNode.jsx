import React, { useRef, useState, useEffect } from "react";

import { Text, Transformer } from "react-konva";

const TextNode = ({ isSelected, onSelect, onChange, ...props }) => {
  const trRef = useRef();
  const shapeRef = useRef();

  useEffect(() => {
    if (isSelected && props.listening !== false) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, props.listening]);

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
        scaleX: scaleX,
        scaleY: scaleY,
      });
    }
  };

  return (
    <>
      <Text
        {...props}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable={onChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && props.listening !== false && onChange ? (
        <Transformer ref={trRef} keepRatio={false} />
      ) : (
        <></>
      )}
    </>
  );
};

export default TextNode;
