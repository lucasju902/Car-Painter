import React from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";

import {
  Box,
  FormControl as MuiFormControl,
  Typography,
  InputLabel,
  Grid,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import FontSelect from "components/FontSelect";
import ColorPickerInput from "components/ColorPickerInput";
import SliderInput from "components/SliderInput";

const TitleTypograhpy = styled(Typography)`
  margin-top: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid gray;
  padding-bottom: 5px;
`;
const FormControl = styled(MuiFormControl)(spacing);

const FontProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    fontList,
  } = props;
  if (!AllowedLayerProps[values.layer_type].includes("layer_data.font"))
    return <></>;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>Font</TitleTypograhpy>
      {AllowedLayerProps[values.layer_type].includes("layer_data.font") ? (
        <FormControl variant="outlined" mt={2}>
          <InputLabel id="font-select-label">Font</InputLabel>
          <FontSelect
            value={values.layer_data.font}
            onChange={(e) => setFieldValue("layer_data.font", e.target.value)}
            fontList={fontList}
          />
        </FormControl>
      ) : (
        <></>
      )}
      {AllowedLayerProps[values.layer_type].includes("layer_data.color") ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" color="textSecondary" mr={2}>
              Font Color
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <ColorPickerInput
              value={values.layer_data.color}
              onChange={(color) => setFieldValue("layer_data.color", color)}
            />
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      {AllowedLayerProps[values.layer_type].includes("layer_data.size") ? (
        <SliderInput
          label="Font Size"
          width={80}
          min={6}
          max={72}
          value={values.layer_data.size}
          setValue={(value) => setFieldValue("layer_data.size", value)}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default FontProperty;
