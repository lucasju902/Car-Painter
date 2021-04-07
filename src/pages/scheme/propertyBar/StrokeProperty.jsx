import React from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";

import { Box, Typography, Grid } from "@material-ui/core";
import ColorPickerInput from "components/ColorPickerInput";
import SliderInput from "components/SliderInput";

const TitleTypograhpy = styled(Typography)`
  margin-top: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid gray;
  padding-bottom: 5px;
`;

const StrokeProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.stroke") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.scolor")
  )
    return <></>;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>Stroke</TitleTypograhpy>
      {AllowedLayerProps[values.layer_type].includes("layer_data.scolor") ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" color="textSecondary" mr={2}>
              Stroke Color
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <ColorPickerInput
              value={values.layer_data.scolor}
              onChange={(color) => setFieldValue("layer_data.scolor", color)}
            />
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      {AllowedLayerProps[values.layer_type].includes("layer_data.stroke") ? (
        <SliderInput
          label="Stroke Width"
          width={80}
          min={0}
          max={10}
          value={values.layer_data.stroke}
          setValue={(value) => setFieldValue("layer_data.stroke", value)}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default StrokeProperty;
