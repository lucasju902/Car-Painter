import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Box } from "components/MaterialUI";
import { useTheme } from "@material-ui/core";
import { ScreenLoader } from "components/common";
import { setPreviousPath, signInWithCookie } from "redux/reducers/authReducer";

// For routes that can only be accessed by authenticated users
export const withAuthGuard = (Component, redirectToSignIn = false) =>
  React.memo((props) => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.authReducer);
    const history = useHistory();
    const theme = useTheme();

    useEffect(() => {
      if (!auth.user) {
        dispatch(
          signInWithCookie(null, () => {
            if (redirectToSignIn) {
              dispatch(setPreviousPath(window.location.pathname));
              history.push("/auth/sign-in");
            }
          })
        );
      } else {
        if (!auth.user.pro_user) {
          window.location.href = "https://www.tradingpaints.com/page/Builder";
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.user]);

    return auth.loading ? (
      <Box
        bgcolor={theme.palette.background.default}
        height="100vh"
        p={0}
        m={0}
      >
        <ScreenLoader />
      </Box>
    ) : (
      <Component {...props} />
    );
  });
