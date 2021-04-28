import React, { useRef } from "react";
import { Rect } from "react-konva";
import { mathRound2 } from "helper";

import { MouseModes } from "constant";

const Shape = ({
  type,
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
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      console.log("scaleX, scaleY: ", scaleX, scaleY);
      // we will reset it back
      node.scaleX(scaleX > 0 ? 1 : -1);
      node.scaleY(scaleY > 0 ? 1 : -1);
      onChange({
        left: mathRound2(node.x()),
        top: mathRound2(node.y()),
        // set minimal value
        width: mathRound2(Math.max(1, node.width() * Math.abs(scaleX))),
        height: mathRound2(Math.max(1, node.height() * Math.abs(scaleY))),
        rotation: mathRound2(node.rotation()) || 0,
        flop: scaleX > 0 ? 0 : 1,
        flip: scaleY > 0 ? 0 : 1,
      });
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
