import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";

import { Link as RouterLink, useHistory } from "react-router-dom";
import { Box, Link, Typography } from "components/MaterialUI";
import { InnerForm } from "./InnerForm";

import { signIn } from "redux/reducers/authReducer";

export const SignIn = React.memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();
  const previousPath = useSelector((state) => state.authReducer.previousPath);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      dispatch(
        signIn(
          { usr: values.usr, password: values.password },
          (returnedUser) => {
            if (!returnedUser.pro_user) {
              window.location.href =
                "https://www.tradingpaints.com/page/Builder";
            } else if (returnedUser) {
              history.push(
                previousPath && previousPath !== "/auth/sign-in"
                  ? previousPath
                  : "/"
              );
            }
          }
        )
      );
    } catch (error) {
      const message = "Invalid Data";

      setStatus({ success: false });
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet title="Sign In" />
      <Box
        display="flex"
        width="100%"
        height="100%"
        padding={10}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bgcolor="#444"
        borderRadius={20}
      >
        <Typography variant="h1" mb={5}>
          Sign In
        </Typography>
        <Formik
          initialValues={{
            usr: "",
            password: "",
            submit: false,
          }}
          validationSchema={Yup.object().shape({
            usr: Yup.string().max(255).required("Email/ID is required"),
            password: Yup.string().max(255).required("Password is required"),
          })}
          onSubmit={handleSubmit}
        >
          {(formProps) => <InnerForm {...formProps} />}
        </Formik>

        <Typography variant="h4" align="center" color="textSecondary">
          Not a member yet?
          <Link
            component={RouterLink}
            to="/auth/sign-up"
            color="primary"
            ml={2}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </>
  );
});

export default SignIn;
