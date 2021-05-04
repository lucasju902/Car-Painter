import Canvg from "canvg";
import React, { useRef, useState, useEffect } from "react";
import Konva from "konva";
import { mathRound2, hexToRgba } from "helper";
import { Image } from "react-konva";

const URLImage = ({
  src,
  tellSize,
  onSelect,
  onChange,
  filterColor,
  frameSize,
  allowFit,
  layer_data,
  ...props
}) => {
  const imageRef = useRef(null);
  const shapeRef = useRef();
  const [image, setImage] = useState(null);
  const filters = [];

  if (filterColor && filterColor.length) {
    filters.push(Konva.Filters.RGBA);
  }
  const getPixelRatio = (node) => {
    if (imageRef.current) {
      return Math.max(
        1,
        imageRef.current.width / node.width(),
        imageRef.current.height / node.height()
      );
    }
    return 1;
  };

  useEffect(() => {
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    if (shapeRef.current) {
      if (filterColor && filterColor.length) {
        shapeRef.current.cache({
          pixelRatio: getPixelRatio(shapeRef.current),
          imageSmoothingEnabled: true,
        });
        // shapeRef.current.getLayer().batchDraw();
      } else {
        shapeRef.current.clearCache();
      }
    }
  }, [filterColor]);

  const handleLoad = async () => {
    let originWidth =
      !allowFit ||
      (imageRef.current.width <= frameSize.width / 2 &&
        imageRef.current.height <= frameSize.height / 2)
        ? imageRef.current.width
        : frameSize.width / 2;
    let originHeight =
      !allowFit ||
      (imageRef.current.width <= frameSize.width / 2 &&
        imageRef.current.height <= frameSize.height / 2)
        ? imageRef.current.height
        : ((frameSize.width / 2) * imageRef.current.height) /
          imageRef.current.width;
    let width = props.width || originWidth;
    let height = props.height || originHeight;

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
        left: mathRound2(props.x - width / 2),
        top: mathRound2(props.y - height / 2),
        width: mathRound2(width),
        height: mathRound2(height),
      });
    }

    if (filterColor && filterColor.length) {
      shapeRef.current.cache({
        pixelRatio: getPixelRatio(shapeRef.current),
        imageSmoothingEnabled: true,
      });
      // shapeRef.current.getLayer().batchDraw();
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
    // img.src = src;
    img.src = src + `?timestamp=${new Date().toISOString()}`;
    img.crossOrigin = "anonymous";
    imageRef.current = img;
    imageRef.current.addEventListener("load", handleLoad);
  };
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
      const xyScale = Math.abs(
        Math.abs(mathRound2(scaleY)) !== 1 ? scaleY : scaleX
      );
      onChange({
        left: mathRound2(node.x()),
        top: mathRound2(node.y()),
        // set minimal value
        width: mathRound2(Math.max(1, node.width() * Math.abs(scaleX))),
        height: mathRound2(Math.max(1, node.height() * Math.abs(scaleY))),
        rotation: mathRound2(node.rotation()) || 0,
        flop: scaleX > 0 ? 0 : 1,
        flip: scaleY > 0 ? 0 : 1,
        shadowBlur: mathRound2(node.shadowBlur() * xyScale),
        shadowOffsetX: mathRound2(layer_data.shadowOffsetX * Math.abs(scaleX)),
        shadowOffsetY: mathRound2(layer_data.shadowOffsetY * Math.abs(scaleY)),
      });
      if (filterColor && filterColor.length) {
        node.cache({
          pixelRatio: getPixelRatio(shapeRef.current),
          imageSmoothingEnabled: true,
        });
        // node.getLayer().batchDraw();
      } else {
        node.clearCache();
      }
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
      filters={filters.length ? filters : null}
      red={filterColor && filterColor.length ? hexToRgba(filterColor).r : null}
      green={
        filterColor && filterColor.length ? hexToRgba(filterColor).g : null
      }
      blue={filterColor && filterColor.length ? hexToRgba(filterColor).b : null}
      alpha={
        filterColor && filterColor.length
          ? hexToRgba(filterColor).a / 255
          : null
      }
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default URLImage;
