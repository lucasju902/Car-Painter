import React, { useState, useEffect } from "react";
import { Box } from "components/MaterialUI";
import { CustomImg, CustomSkeleton } from "./SVGImageWithLoad.style";
import { replaceColors, svgToURL, urlToString } from "helper/svg";

export const SVGImageWithLoad = ({
  src,
  onClick,
  ImageComponent,
  minHeight = "100%",
  minWidth = "100%",
  justifyContent = "center",
  options,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState();
  const [loaded, setLoaded] = useState(false);

  const loadImage = async () => {
    let svgString = await urlToString(
      src + `?timestamp=${new Date().toISOString()}`
    );
    if (options) {
      svgString = replaceColors(svgString, {
        color: options.color,
        stroke: options.stroke,
        opacity: options.opacity,
        strokeWidth: options.strokeWidth,
      });
    }
    setImageSrc(svgToURL(svgString));
  };

  useEffect(() => {
    loadImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      position="relative"
      minHeight={minHeight}
      minWidth={minWidth}
      display="flex"
      justifyContent={justifyContent}
      alignItems="center"
    >
      {imageSrc && ImageComponent ? (
        <ImageComponent
          src={imageSrc}
          {...props}
          onClick={onClick}
          onLoad={() => setLoaded(true)}
        />
      ) : imageSrc ? (
        <CustomImg
          src={imageSrc}
          {...props}
          onClick={onClick}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <></>
      )}
      {!imageSrc || !loaded ? (
        <CustomSkeleton variant="rect" onClick={onClick} />
      ) : (
        <></>
      )}
    </Box>
  );
};
