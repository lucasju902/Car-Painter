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

const ImageWithLoad = ({ src, onClick, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box position="relative" minHeight="200px">
      <CustomImg
        src={src}
        {...props}
        onClick={onClick}
        onLoad={() => setLoaded(true)}
      />
      {!loaded ? <CustomSkeleton variant="rect" onClick={onClick} /> : <></>}
    </Box>
  );
};

export default ImageWithLoad;
