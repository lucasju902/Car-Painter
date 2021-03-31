import Canvg from "canvg";
import React, { useRef, useState, useEffect } from "react";

import { Image } from "react-konva";

const URLImage = ({
  src,
  tellSize,
  isSelected,
  onSelect,
  onChange,
  ...props
}) => {
  const imageRef = useRef(null);
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

  const handleLoad = async () => {
    let width = props.width || imageRef.current.width;
    let height = props.height || imageRef.current.height;
    if (
      src.toLowerCase().includes(".svg") &&
      (!imageRef.current.width || !imageRef.current.height)
    ) {
      let canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const v = await Canvg.from(ctx, src, {
        enableRedraw: true,
      });
      console.log(v);
      width = width || v.documentElement.node.width.baseVal.value || 200;
      height = height || v.documentElement.node.height.baseVal.value || 200;
      v.resize(width, height, "none");
      await v.render();
      setImage(canvas);
    } else {
      setImage(imageRef.current);
    }
    if (onChange && !props.width && !props.height) {
      onChange({
        left: props.x - width / 2,
        top: props.y - height / 2,
        width: width,
        height: height,
      });
    }
    if (tellSize) {
      tellSize({
        width: width,
        height: height,
      });
    }
  };
  const loadImage = async () => {
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
  );
};

export default URLImage;
