import React, { useState } from "react";
import { Box } from "components/MaterialUI";
import { CustomImg, CustomSkeleton } from "./ImageWithLoad.style";

export const ImageWithLoad = ({
  src,
  onClick,
  ImageComponent,
  minHeight = "100%",
  minWidth = "100%",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      position="relative"
      minHeight={minHeight}
      minWidth={minWidth}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {ImageComponent ? (
        <ImageComponent
          src={src}
          {...props}
          onClick={onClick}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <CustomImg
          src={src}
          {...props}
          onClick={onClick}
          onLoad={() => setLoaded(true)}
        />
      )}
      {!loaded ? <CustomSkeleton variant="rect" onClick={onClick} /> : <></>}
    </Box>
  );
};
