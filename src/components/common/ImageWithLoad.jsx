import React, { useState } from "react";
import { Box } from "components/MaterialUI";
import { Skeleton } from "@material-ui/lab";
import styled from "styled-components/macro";

const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
  cursor: pointer;
`;

const CustomSkeleton = styled(Skeleton)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

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

export default ImageWithLoad;
