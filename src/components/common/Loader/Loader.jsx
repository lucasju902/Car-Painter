import React from "react";

import { CircularProgress } from "@material-ui/core";
import { Root } from "./Loader.style";

export const Loader = React.memo(() => {
  return (
    <Root>
      <CircularProgress m={2} color="secondary" />
    </Root>
  );
});

export default Loader;
