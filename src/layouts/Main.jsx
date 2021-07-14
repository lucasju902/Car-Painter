import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import styled, { createGlobalStyle } from "styled-components/macro";
import { CssBaseline, withWidth } from "@material-ui/core";

import { useHistory } from "react-router";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.palette.background.default};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;

const Root = styled.div`
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
`;

const Main = ({ children }) => {
  const history = useHistory();
  const user = useSelector((state) => state.authReducer.user);

  useEffect(() => {
    if (!user) {
      history.push("/auth/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {children}
    </Root>
  );
};

export default withWidth()(Main);
