import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Image, Group, Rect } from "react-konva";
import Konva from "konva";
import Canvg from "canvg";
import { mathRound2, hexToRgba } from "helper";
import { replaceColors, svgToURL, urlToString } from "helper/svg";
import { useDragMove } from "hooks";

export const GroupedURLImage = ({
  id,
  src,
  editable,
  stageRef,
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
  stroke,
  strokeWidth,
  strokeScale,
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
  const imageshapeRef = useRef();
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

  const applyCaching = useCallback(() => {
    if (imageshapeRef.current) {
      imageshapeRef.current.cache({
        pixelRatio: getPixelRatio(imageshapeRef.current),
        imageSmoothingEnabled: true,
      });
    }
  }, [imageshapeRef, getPixelRatio]);

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
          strokeWidth: strokeWidth * strokeScale,
        });
      }

      loadImage(svgToURL(svgString));
    },
    [loadImage, filterColor, stroke, strokeWidth, strokeScale]
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
    [handleExtraDragEnd, onChange, onDragEnd]
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
        const imageNode = imageshapeRef.current;
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
          shadowBlur: mathRound2(imageNode.shadowBlur() * xyScale),
          shadowOffsetX: mathRound2(
            (layer_data.shadowOffsetX || 0) * Math.abs(scaleX)
          ),
          shadowOffsetY: mathRound2(
            (layer_data.shadowOffsetY || 0) * Math.abs(scaleY)
          ),
          paddingX: mathRound2((layer_data.paddingX || 0) * Math.abs(scaleX)),
          paddingY: mathRound2((layer_data.paddingY || 0) * Math.abs(scaleY)),
        });
        applyCaching();

        if (onDragEnd) onDragEnd();
      }
    },
    [
      onChange,
      layer_data.shadowOffsetX,
      layer_data.shadowOffsetY,
      layer_data.paddingX,
      layer_data.paddingY,
      applyCaching,
      onDragEnd,
    ]
  );

  return (
    <Group
      {...props}
      name={id ? id.toString() : null}
      ref={shapeRef}
      onClick={onSelect}
      onDblClick={onDblClick}
      onTap={onSelect}
      draggable={onChange && editable}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onTransformStart={handleTransformStart}
      onTransformEnd={handleTransformEnd}
      onMouseOver={() => props.listening && onHover && onHover(true)}
      onMouseOut={() => props.listening && onHover && onHover(false)}
    >
      {bgColor ? (
        <Rect
          x={-paddingX || 0}
          y={-paddingY || 0}
          width={props.width + 2 * (paddingX || 0)}
          height={props.height + 2 * (paddingY || 0)}
          fill={bgColor}
        />
      ) : (
        <></>
      )}

      <Image
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        shadowBlur={shadowBlur}
        shadowColor={shadowColor}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        red={allowFilter ? hexToRgba(filterColor).r : null}
        green={allowFilter ? hexToRgba(filterColor).g : null}
        blue={allowFilter ? hexToRgba(filterColor).b : null}
        alpha={allowFilter ? hexToRgba(filterColor).a / 255 : null}
        filters={allowFilter ? filters : null}
        image={image}
        ref={imageshapeRef}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />
    </Group>
  );
};

export default GroupedURLImage;
