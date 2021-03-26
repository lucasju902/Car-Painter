import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled, { createGlobalStyle } from "styled-components/macro";
import { CssBaseline, withWidth } from "@material-ui/core";
import ScreenLoader from "components/ScreenLoader";

import { signInWithCookie } from "redux/reducers/authReducer";

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

const Main = ({ children, routes, width }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const authLoading = useSelector((state) => state.authReducer.loading);

  useEffect(() => {
    if (!user) {
      dispatch(signInWithCookie());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {authLoading ? <ScreenLoader /> : children}
    </Root>
  );
};

export default withWidth()(Main);
