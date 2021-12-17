import React from "react";

import { Box } from "@material-ui/core";
import Loading from "assets/loading.svg";

export const ScreenLoader = React.memo(() => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <img src={Loading} alt="ScreenLoader" width="200px" height="200px" />
    </Box>
  );
});

export default ScreenLoader;
