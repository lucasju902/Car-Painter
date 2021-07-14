import React, { useState } from "react";
import * as Yup from "yup";
import styled from "styled-components";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";

import { Link as RouterLink, useHistory } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  Typography,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "components/MaterialUI";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

import { signIn } from "redux/reducers/authReducer";

const FullForm = styled.form`
  width: 100%;
`;

const InnerForm = (props) => {
  const {
    errors,
    isSubmitting,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FullForm noValidate onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert mt={2} mb={1} severity="warning">
          {errors.submit}
        </Alert>
      )}
      <TextField
        autoComplete="off"
        type="text"
        name="usr"
        label="Email or iRacing Customer ID number"
        variant="outlined"
        color="primary"
        value={values.usr}
        error={Boolean(touched.usr && errors.usr)}
        fullWidth
        helperText={touched.usr && errors.usr}
        onBlur={handleBlur}
        onChange={handleChange}
        margin="normal"
      />
      <FormControl
        fullWidth
        margin="normal"
        variant="outlined"
        color="primary"
        error={Boolean(touched.password && errors.password)}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                color="default"
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
        <FormHelperText id="password-helper-text">
          {errors.password}
        </FormHelperText>
      </FormControl>
      <Link component={RouterLink} to="/auth/reset-password" color="primary">
        Forgot password?
      </Link>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={isSubmitting}
        my={5}
      >
        Log in
      </Button>
    </FullForm>
  );
};

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.authReducer.user);

  React.useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      dispatch(signIn({ usr: values.usr, password: values.password }));
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
        bgcolor="#333"
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
};

export default SignIn;
