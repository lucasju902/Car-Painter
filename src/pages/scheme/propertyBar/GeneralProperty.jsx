import React from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";

import { Box, TextField, Typography, IconButton } from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@material-ui/icons";

const TitleTypograhpy = styled(Typography)`
  margin-top: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid gray;
  padding-bottom: 5px;
`;
const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

const GeneralProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;

  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.name") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.text")
  )
    return <></>;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>General</TitleTypograhpy>
      {AllowedLayerProps[values.layer_type].includes("layer_data.name") ? (
        <CustomeTextField
          name="layer_data.name"
          label="Name"
          variant="outlined"
          value={values.layer_data.name}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.name &&
              errors.layer_data &&
              errors.layer_data.name
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.name &&
            errors.layer_data &&
            errors.layer_data.name
          }
          onBlur={handleBlur}
          onChange={handleChange}
          fullWidth
          margin="normal"
          mb={4}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ) : (
        <></>
      )}
      {AllowedLayerProps[values.layer_type].includes("layer_data.text") ? (
        <CustomeTextField
          name="layer_data.text"
          label="Text"
          variant="outlined"
          value={values.layer_data.text}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.text &&
              errors.layer_data &&
              errors.layer_data.text
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.text &&
            errors.layer_data &&
            errors.layer_data.text
          }
          onBlur={handleBlur}
          onChange={handleChange}
          fullWidth
          margin="normal"
          mb={4}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ) : (
        <></>
      )}
      {AllowedLayerProps[values.layer_type].includes("layer_visible") ? (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="body1" color="textSecondary" mr={2}>
            Visibility
          </Typography>
          <IconButton
            onClick={() =>
              setFieldValue("layer_visible", 1 - values.layer_visible)
            }
            size="small"
          >
            {values.layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Box>
      ) : (
        <></>
      )}
      {AllowedLayerProps[values.layer_type].includes("layer_locked") ? (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="body1" color="textSecondary" mr={2}>
            Locking
          </Typography>
          <IconButton
            onClick={() =>
              setFieldValue("layer_locked", 1 - values.layer_locked)
            }
            size="small"
          >
            {values.layer_locked ? <LockIcon /> : <LockOpenIcon />}
          </IconButton>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default GeneralProperty;
