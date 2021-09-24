import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Image } from "react-konva";
import Konva from "konva";
import Canvg from "canvg";
import { mathRound2, hexToRgba } from "helper";
import { replaceColors, svgToURL, urlToString } from "helper/svg";
import { useDragMove } from "hooks";

export const URLImage = ({
  id,
  src,
  stageRef,
  filterColor,
  frameSize,
  allowFit,
  layer_data,
  loadedStatus,
  onLoadLayer,
  tellSize,
  stroke,
  strokeWidth,
  shadowBlur,
  shadowColor,
  shadowOffsetX,
  shadowOffsetY,
  paintingGuides,
  guideData,
  onSelect,
  onDblClick,
  onChange,
  onHover,
  onDragStart,
  onDragEnd,
  ...props
}) => {
  const imageRef = useRef(null);
  const shapeRef = useRef();
  const [image, setImage] = useState(null);
  const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);
  const allowFilter = useMemo(
    () => !isSVG && filterColor && filterColor.length,
    [filterColor, isSVG]
  );
  const filters = useMemo(() => (allowFilter ? [Konva.Filters.RGBA] : []), [
    allowFilter,
  ]);
  const [handleDragMove, handleExtraDragEnd] = useDragMove(
    stageRef,
    shapeRef,
    paintingGuides,
    guideData,
    frameSize
  );

  const getPixelRatio = useCallback((node) => {
    if (imageRef.current) {
      if (imageRef.current.width && imageRef.current.height)
        return Math.max(
          1,
          imageRef.current.width / node.width(),
          imageRef.current.height / node.height()
        );
      return 5;
    }
    return 1;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (loadedStatus !== false && loadedStatus !== true && onLoadLayer && id)
      onLoadLayer(id, false);
    if (isSVG) {
      await setImgFromSVG(src);
    } else {
      loadImage(src + `?timestamp=${new Date().toISOString()}`);
    }
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (image && isSVG) {
      await setImgFromSVG(src);
      applyCaching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stroke, strokeWidth, filterColor]);

  useEffect(() => {
    if (image) {
      applyCaching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY]);

  const applyCaching = useCallback(() => {
    if (shapeRef.current) {
      shapeRef.current.cache({
        pixelRatio: getPixelRatio(shapeRef.current),
        imageSmoothingEnabled: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeRef, filterColor]);

  const handleLoad = useCallback(async () => {
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

    if (isSVG && navigator.userAgent.indexOf("Firefox") !== -1) {
      let canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const v = await Canvg.from(ctx, imageRef.current.src, {
        enableRedraw: true,
      });
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

    applyCaching();

    if (tellSize) {
      tellSize({
        width: width,
        height: height,
      });
    }
    if (onLoadLayer && id) onLoadLayer(id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    frameSize,
    allowFit,
    props.width,
    props.height,
    tellSize,
    onLoadLayer,
    onChange,
    setImage,
    getPixelRatio,
    mathRound2,
    applyCaching,
  ]);

  const loadImage = useCallback(
    async (imageSource) => {
      const img = new window.Image();
      img.src = imageSource;
      img.crossOrigin = "anonymous";
      imageRef.current = img;
      imageRef.current.addEventListener("load", handleLoad);
    },
    [handleLoad]
  );

  const setImgFromSVG = useCallback(
    async (src) => {
      let svgString = await urlToString(
        src + `?timestamp=${new Date().toISOString()}`
      );
      if (filterColor) {
        svgString = replaceColors(svgString, {
          color: filterColor,
          stroke: stroke,
          strokeWidth: strokeWidth * 5,
        });
      }

      loadImage(svgToURL(svgString));
    },
    [loadImage, filterColor, stroke, strokeWidth]
  );

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
        onChange({
          left: mathRound2(e.target.x()),
          top: mathRound2(e.target.y()),
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
          shadowOffsetX: mathRound2(
            layer_data.shadowOffsetX * Math.abs(scaleX)
          ),
          shadowOffsetY: mathRound2(
            layer_data.shadowOffsetY * Math.abs(scaleY)
          ),
        });
        applyCaching();
      }
      if (onDragEnd) onDragEnd();
    },
    [onChange, onDragEnd, layer_data, applyCaching]
  );

  return (
    <Image
      {...props}
      image={image}
      onDblClick={onDblClick}
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      draggable={onChange}
      shadowBlur={shadowBlur}
      shadowColor={shadowColor}
      shadowOffsetX={shadowOffsetX}
      shadowOffsetY={shadowOffsetY}
      red={allowFilter ? hexToRgba(filterColor).r : null}
      green={allowFilter ? hexToRgba(filterColor).g : null}
      blue={allowFilter ? hexToRgba(filterColor).b : null}
      alpha={allowFilter ? hexToRgba(filterColor).a / 255 : null}
      filters={allowFilter ? filters : null}
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

export default URLImage;
