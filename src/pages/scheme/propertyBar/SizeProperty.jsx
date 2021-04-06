import React from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";
import Helper from "helper";

import { Box, TextField, Typography } from "@material-ui/core";

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

const SizeProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  if (
    !AllowedLayerProps[values.layer_type].includes("width") &&
    !AllowedLayerProps[values.layer_type].includes("height") &&
    !AllowedLayerProps[values.layer_type].includes("scaleX") &&
    !AllowedLayerProps[values.layer_type].includes("scaleY")
  )
    return <></>;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>Size</TitleTypograhpy>
      {AllowedLayerProps[values.layer_type].includes("width") ? (
        <CustomeTextField
          name="layer_data.width"
          label="Width"
          variant="outlined"
          type="number"
          value={Helper.mathRound2(values.layer_data.width)}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.width &&
              errors.layer_data &&
              errors.layer_data.width
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.width &&
            errors.layer_data &&
            errors.layer_data.width
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
      {AllowedLayerProps[values.layer_type].includes("height") ? (
        <CustomeTextField
          name="layer_data.height"
          label="Height"
          variant="outlined"
          type="number"
          value={Helper.mathRound2(values.layer_data.height)}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.height &&
              errors.layer_data &&
              errors.layer_data.height
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.height &&
            errors.layer_data &&
            errors.layer_data.height
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
      {AllowedLayerProps[values.layer_type].includes("scaleX") ? (
        <CustomeTextField
          name="layer_data.scaleX"
          label="ScaleX"
          variant="outlined"
          type="number"
          value={Helper.mathRound2(values.layer_data.scaleX)}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.scaleX &&
              errors.layer_data &&
              errors.layer_data.scaleX
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.scaleX &&
            errors.layer_data &&
            errors.layer_data.scaleX
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
      {AllowedLayerProps[values.layer_type].includes("scaleY") ? (
        <CustomeTextField
          name="layer_data.scaleY"
          label="ScaleY"
          variant="outlined"
          type="number"
          value={Helper.mathRound2(values.layer_data.scaleY)}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.scaleY &&
              errors.layer_data &&
              errors.layer_data.scaleY
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.scaleY &&
            errors.layer_data &&
            errors.layer_data.scaleY
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
    </Box>
  );
};

export default SizeProperty;
