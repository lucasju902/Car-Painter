import React from "react";

import { CssBaseline } from "@material-ui/core";
import { GlobalStyle, Root } from "./Auth.style";
import { withMessage } from "hooks/withMessage";

export const Auth = withMessage(({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {children}
    </Root>
  );
});
