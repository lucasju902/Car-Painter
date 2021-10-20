import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import Canvg from "canvg";
import { mathRound2, getPixelRatio, loadImage } from "helper";
import { replaceColors, svgToURL, urlToString } from "helper/svg";

export const useKonvaImageInit = ({
  imageshapeRef,
  id,
  src,
  stroke,
  strokeWidth,
  filterColor,
  shadowBlur,
  shadowColor,
  shadowOffsetX,
  shadowOffsetY,
  strokeScale,
  allowFit,
  frameSize,
  loadedStatus,
  width,
  height,
  x,
  y,
  onChange,
  tellSize,
  onLoadLayer,
}) => {
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const isSVG = useMemo(() => src.toLowerCase().includes(".svg"), [src]);

  const applyCaching = useCallback(() => {
    if (imageshapeRef.current) {
      imageshapeRef.current.cache({
        pixelRatio: getPixelRatio(imageshapeRef.current, imageRef.current),
        imageSmoothingEnabled: true,
      });
    }
  }, [imageshapeRef, imageRef]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (loadedStatus !== false && loadedStatus !== true && onLoadLayer && id)
      onLoadLayer(id, false);
    if (isSVG) {
      await setImgFromSVG(src);
    } else {
      loadImage(
        src + `?timestamp=${new Date().toISOString()}`,
        imageRef,
        handleLoad,
        handleError
      );
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
  }, [shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, width, height]);

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
    let targetWidth = width || originWidth || 200;
    let targetHeight = height || originHeight || 200;

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

    if (onChange && !width && !height && targetWidth && targetHeight) {
      onChange({
        left: mathRound2(x - targetWidth / 2),
        top: mathRound2(y - targetHeight / 2),
        width: mathRound2(targetWidth),
        height: mathRound2(targetHeight),
      });
    }

    applyCaching();

    if (tellSize) {
      tellSize({
        width: targetWidth,
        height: targetHeight,
      });
    }
    if (onLoadLayer && id) onLoadLayer(id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    frameSize,
    allowFit,
    width,
    height,
    x,
    y,
    tellSize,
    onChange,
    setImage,
    applyCaching,
  ]);

  const handleError = useCallback(
    (error) => {
      console.log("Image Loading Error: ", error);
      if (onLoadLayer && id) onLoadLayer(id, true);
    },
    [onLoadLayer, id]
  );

  const setImgFromSVG = useCallback(
    async (src) => {
      let svgString = await urlToString(
        src + `?timestamp=${new Date().toISOString()}`
      );
      if (filterColor || stroke || strokeWidth) {
        svgString = replaceColors(svgString, {
          color: filterColor,
          stroke: stroke,
          strokeWidth: strokeWidth * strokeScale,
        });
      }

      loadImage(svgToURL(svgString), imageRef, handleLoad, handleError);
    },
    [
      filterColor,
      imageRef,
      handleLoad,
      handleError,
      stroke,
      strokeWidth,
      strokeScale,
    ]
  );

  return [image, imageRef, applyCaching];
};
