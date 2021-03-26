import React from "react";

import { Box } from "@material-ui/core";
import Loader from "./Loader";

const ScreenLoader = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Loader />
    </Box>
  );
};

export default ScreenLoader;
