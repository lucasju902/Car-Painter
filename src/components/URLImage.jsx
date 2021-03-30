import React, { useRef, useState, useEffect } from "react";

import { Image, Transformer } from "react-konva";

const URLImage = ({
  src,
  tellSize,
  isSelected,
  onSelect,
  onChange,
  ...props
}) => {
  const imageRef = useRef(null);
  const trRef = useRef();
  const shapeRef = useRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    loadImage();
  }, [props.src]);
  useEffect(() => {
    if (isSelected && props.listening !== false) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, props.listening]);

  const handleLoad = () => {
    setImage(imageRef.current);
    if (tellSize) {
      tellSize({
        width: props.width || imageRef.current.width,
        height: props.height || imageRef.current.height,
      });
    }
  };
  const loadImage = () => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    imageRef.current = img;
    imageRef.current.addEventListener("load", handleLoad);
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
      node.scaleX(scaleX > 0 ? 1 : -1);
      node.scaleY(scaleY > 0 ? 1 : -1);
      onChange({
        left: node.x(),
        top: node.y(),
        // set minimal value
        width: Math.max(5, node.width() * Math.abs(scaleX)),
        height: Math.max(5, node.height() * Math.abs(scaleY)),
        rotation: node.rotation(),
        flop: scaleX > 0 ? 0 : 1,
        flip: scaleY > 0 ? 0 : 1,
      });
    }
  };

  return (
    <>
      <Image
        {...props}
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable={onChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && props.listening !== false && onChange ? (
        <Transformer ref={trRef} keepRatio={false} centeredScaling={true} />
      ) : (
        <></>
      )}
    </>
  );
};

export default URLImage;
