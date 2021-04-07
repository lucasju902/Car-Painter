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

const PositionProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.left") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.top")
  )
    return <></>;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>Position</TitleTypograhpy>
      {AllowedLayerProps[values.layer_type].includes("layer_data.left") ? (
        <CustomeTextField
          name="layer_data.left"
          label="Left"
          variant="outlined"
          type="number"
          value={Helper.mathRound2(values.layer_data.left)}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.left &&
              errors.layer_data &&
              errors.layer_data.left
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.left &&
            errors.layer_data &&
            errors.layer_data.left
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
      {AllowedLayerProps[values.layer_type].includes("layer_data.top") ? (
        <CustomeTextField
          name="layer_data.top"
          label="Top"
          variant="outlined"
          type="number"
          value={Helper.mathRound2(values.layer_data.top)}
          error={Boolean(
            touched.layer_data &&
              touched.layer_data.top &&
              errors.layer_data &&
              errors.layer_data.top
          )}
          helperText={
            touched.layer_data &&
            touched.layer_data.top &&
            errors.layer_data &&
            errors.layer_data.top
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

export default PositionProperty;
