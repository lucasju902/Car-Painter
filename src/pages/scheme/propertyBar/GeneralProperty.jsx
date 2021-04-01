import React from "react";
import styled from "styled-components/macro";
import { LayerTypes } from "constant";

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

const GeneralProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>General</TitleTypograhpy>
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
      {values.layer_type === LayerTypes.TEXT ? (
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
    </Box>
  );
};

export default GeneralProperty;
