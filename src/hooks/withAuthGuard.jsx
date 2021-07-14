import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Box } from "components/MaterialUI";
import ScreenLoader from "components/ScreenLoader";
import { signInWithCookie } from "redux/reducers/authReducer";

// For routes that can only be accessed by authenticated users
export const withAuthGuard = (Component, redirectToSignIn = false) => (
  props
) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer);
  const history = useHistory();

  useEffect(() => {
    if (!auth.user) {
      dispatch(
        signInWithCookie(null, () => {
          if (redirectToSignIn) {
            history.push("/auth/sign-in");
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return auth.loading ? (
    <Box bgcolor="#1B2635" height="100vh" p={0} m={0}>
      <ScreenLoader />
    </Box>
  ) : (
    <Component {...props} />
  );
};
