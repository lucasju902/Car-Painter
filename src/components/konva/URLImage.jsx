import Canvg from "canvg";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Konva from "konva";
import { mathRound2, hexToRgba } from "helper";
import { Image } from "react-konva";

export const URLImage = ({
  id,
  src,
  filterColor,
  frameSize,
  allowFit,
  layer_data,
  loadedStatus,
  onLoadLayer,
  tellSize,
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
  const filters = useMemo(
    () => (filterColor && filterColor.length ? [Konva.Filters.RGBA] : []),
    [filterColor]
  );

  const getPixelRatio = useCallback((node) => {
    if (imageRef.current) {
      return Math.max(
        1,
        imageRef.current.width / node.width(),
        imageRef.current.height / node.height()
      );
    }
    return 1;
  }, []);

  const setImgFromSVG = useCallback(
    async (src, width, height) => {
      let canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const v = await Canvg.from(
        ctx,
        src + `?timestamp=${new Date().toISOString()}`,
        {
          enableRedraw: true,
        }
      );
      let originWidth = v.documentElement.node.width.baseVal.value;
      let originHeight = v.documentElement.node.height.baseVal.value;
      if (originWidth && originHeight && originWidth > 200) {
        originHeight = (originHeight * 200) / originWidth;
        originWidth = 200;
      }
      v.resize(
        width || originWidth || 200,
        height || originHeight || 200,
        "none"
      );
      await v.render();
      setImage(canvas);
    },
    [setImage]
  );

  const applyFilterColor = useCallback(() => {
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
  }, [shapeRef, filterColor]);

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

  useEffect(async () => {
    if (
      image &&
      props.width &&
      props.height &&
      src.toLowerCase().includes(".svg")
    ) {
      await setImgFromSVG(src, props.width, props.height);
      applyFilterColor();
    }
  }, [props.width, props.height, filterColor]);

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

    if (src.toLowerCase().includes(".svg")) {
      await setImgFromSVG(src, width, height);
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

    applyFilterColor();

    if (tellSize) {
      tellSize({
        width: width,
        height: height,
      });
    }
    if (onLoadLayer && id) onLoadLayer(id, true);
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
    setImgFromSVG,
    applyFilterColor,
  ]);
  const loadImage = useCallback(async () => {
    const img = new window.Image();
    // img.src = src;
    img.src = src + `?timestamp=${new Date().toISOString()}`;
    img.crossOrigin = "anonymous";
    imageRef.current = img;
    imageRef.current.addEventListener("load", handleLoad);
  }, [handleLoad]);
  const handleDragStart = useCallback(
    (e) => {
      onSelect();
      if (onDragStart) onDragStart();
    },
    [onSelect, onDragStart]
  );
  const handleDragEnd = useCallback(
    (e) => {
      if (onChange) {
        onChange({
          left: mathRound2(e.target.x()),
          top: mathRound2(e.target.y()),
        });
      }
      if (onDragEnd) onDragEnd();
    },
    [mathRound2, onChange, onDragEnd]
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
        applyFilterColor();
      }
      if (onDragEnd) onDragEnd();
    },
    [
      filterColor,
      mathRound2,
      getPixelRatio,
      onChange,
      onDragEnd,
      applyFilterColor,
    ]
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
      filters={filters.length ? filters : null}
      red={
        filterColor && filterColor.length && hexToRgba(filterColor)
          ? hexToRgba(filterColor).r
          : null
      }
      green={
        filterColor && filterColor.length && hexToRgba(filterColor)
          ? hexToRgba(filterColor).g
          : null
      }
      blue={
        filterColor && filterColor.length && hexToRgba(filterColor)
          ? hexToRgba(filterColor).b
          : null
      }
      alpha={
        filterColor && filterColor.length && hexToRgba(filterColor)
          ? hexToRgba(filterColor).a / 255
          : null
      }
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
