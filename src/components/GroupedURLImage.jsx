import Canvg from "canvg";
import React, { useRef, useState, useEffect } from "react";
import Konva from "konva";
import { mathRound2, hexToRgba } from "helper";
import { Image, Group, Rect } from "react-konva";

const GroupedURLImage = ({
  id,
  src,
  bgColor = null,
  paddingX = 0,
  paddingY = 0,
  filterColor,
  frameSize,
  allowFit,
  layer_data,
  loadedStatus,
  onLoadLayer,
  tellSize,
  onSelect,
  onChange,
  onHover,
  onDragStart,
  onDragEnd,
  ...props
}) => {
  const imageRef = useRef(null);
  const shapeRef = useRef();
  const imageshapeRef = useRef();
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
    if (loadedStatus !== false && loadedStatus !== true && onLoadLayer && id)
      onLoadLayer(id, false);
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    if (imageshapeRef.current) {
      if (filterColor && filterColor.length) {
        imageshapeRef.current.cache({
          pixelRatio: getPixelRatio(imageshapeRef.current),
          imageSmoothingEnabled: true,
        });
        // imageshapeRef.current.getLayer().batchDraw();
      } else {
        imageshapeRef.current.clearCache();
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
      imageshapeRef.current.cache({
        pixelRatio: getPixelRatio(imageshapeRef.current),
        imageSmoothingEnabled: true,
      });
      // imageshapeRef.current.getLayer().batchDraw();
    }
    if (tellSize) {
      tellSize({
        width: width,
        height: height,
      });
    }
    if (onLoadLayer && id) onLoadLayer(id, true);
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
    if (onDragStart) onDragStart();
  };
  const handleDragEnd = (e) => {
    if (onChange) {
      onChange({
        left: mathRound2(e.target.x()),
        top: mathRound2(e.target.y()),
      });
    }
    if (onDragEnd) onDragEnd();
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
        const imageNode = imageshapeRef.current;
        imageNode.cache({
          pixelRatio: getPixelRatio(shapeRef.current),
          imageSmoothingEnabled: true,
        });
        // imageNode.getLayer().batchDraw();
      } else {
        imageshapeRef.current.clearCache();
      }
    }
  };

  return (
    <Group
      {...props}
      ref={shapeRef}
      onClick={onSelect}
      onTap={onSelect}
      draggable={onChange}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onMouseOver={() => props.listening && onHover && onHover(true)}
      onMouseOut={() => props.listening && onHover && onHover(false)}
    >
      <Rect width={props.width} height={props.height} fill={bgColor} />
      <Image
        x={paddingX}
        y={paddingY}
        width={props.width - 2 * paddingX}
        height={props.height - 2 * paddingY}
        image={image}
        ref={imageshapeRef}
        red={
          filterColor && filterColor.length ? hexToRgba(filterColor).r : null
        }
        green={
          filterColor && filterColor.length ? hexToRgba(filterColor).g : null
        }
        blue={
          filterColor && filterColor.length ? hexToRgba(filterColor).b : null
        }
        alpha={
          filterColor && filterColor.length
            ? hexToRgba(filterColor).a / 255
            : null
        }
        filters={filters.length ? filters : null}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />
    </Group>
  );
};

export default GroupedURLImage;
