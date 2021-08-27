import React, { useState } from "react";

import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Button,
  Link,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "components/MaterialUI";
import { FullForm, VisibilityIcon, VisibilityOffIcon } from "./InnerForm.style";

export const InnerForm = (props) => {
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
