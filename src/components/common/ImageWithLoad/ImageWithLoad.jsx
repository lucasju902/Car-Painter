import React, { useState } from "react";
import { Box } from "components/MaterialUI";
import { CustomImg, CustomSkeleton } from "./ImageWithLoad.style";

export const ImageWithLoad = React.memo(
  ({
    src,
    altSrc,
    fallbackSrc,
    onClick,
    ImageComponent,
    minHeight = "100%",
    minWidth = "100%",
    justifyContent = "center",
    ...props
  }) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <Box
        position="relative"
        minHeight={minHeight}
        minWidth={minWidth}
        display="flex"
        justifyContent={justifyContent}
        alignItems="start"
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
            onError={(e) => {
              if (e.target.src !== altSrc && altSrc) e.target.src = altSrc;
              else if (e.target.src !== fallbackSrc && fallbackSrc)
                e.target.src = fallbackSrc;
            }}
          />
        )}
        {!loaded ? <CustomSkeleton variant="rect" onClick={onClick} /> : <></>}
      </Box>
    );
  }
);
