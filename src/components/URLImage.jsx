import Canvg from "canvg";
import React, { useRef, useState, useEffect } from "react";
import Konva from "konva";
import Helper from "helper";
import { Image } from "react-konva";

const URLImage = ({
  src,
  tellSize,
  isSelected,
  onSelect,
  onChange,
  filterColor,
  frameSize,
  ...props
}) => {
  const imageRef = useRef(null);
  const shapeRef = useRef();
  const [image, setImage] = useState(null);
  const filters = [];

  if (filterColor) {
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
      if (filterColor) {
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
      !frameSize ||
      (imageRef.current.width <= frameSize.width &&
        imageRef.current.height <= frameSize.height)
        ? imageRef.current.width
        : frameSize.width / 2;
    let originHeight =
      !frameSize ||
      (imageRef.current.width < frameSize.width &&
        imageRef.current.height < frameSize.height)
        ? imageRef.current.width
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
        left: Helper.mathRound2(props.x - width / 2),
        top: Helper.mathRound2(props.y - height / 2),
        width: Helper.mathRound2(width),
        height: Helper.mathRound2(height),
      });
    }

    if (filterColor) {
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
        left: Helper.mathRound2(e.target.x()),
        top: Helper.mathRound2(e.target.y()),
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
        left: Helper.mathRound2(node.x()),
        top: Helper.mathRound2(node.y()),
        // set minimal value
        width: Helper.mathRound2(Math.max(1, node.width() * Math.abs(scaleX))),
        height: Helper.mathRound2(
          Math.max(1, node.height() * Math.abs(scaleY))
        ),
        rotation: Helper.mathRound2(node.rotation()) || 0,
        flop: scaleX > 0 ? 0 : 1,
        flip: scaleY > 0 ? 0 : 1,
      });
      if (filterColor) {
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
      red={filterColor ? Helper.hexToRgba(filterColor).r : null}
      green={filterColor ? Helper.hexToRgba(filterColor).g : null}
      blue={filterColor ? Helper.hexToRgba(filterColor).b : null}
      alpha={filterColor ? Helper.hexToRgba(filterColor).a / 255 : null}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      // onTransform={handleTransform}
    />
  );
};

export default URLImage;
