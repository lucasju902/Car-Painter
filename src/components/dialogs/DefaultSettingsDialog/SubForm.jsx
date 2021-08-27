import React from "react";

import { Box, Typography, Grid } from "components/MaterialUI";
import { ColorPickerInput, SliderInput } from "components/common";

export const SubForm = (props) => {
  const {
    colorKey,
    opacityKey,
    errors,
    setFieldValue,
    values,
    extraChildren,
  } = props;
  return (
    <Box display="flex" flexDirection="column" width="100%" mb={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1" color="textSecondary" mr={2}>
              Color
            </Typography>
            <ColorPickerInput
              value={values[colorKey]}
              onChange={(color) => setFieldValue(colorKey, color)}
              onInputChange={(color) => setFieldValue(colorKey, color)}
              error={Boolean(errors[colorKey])}
              helperText={errors[colorKey]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Opacity"
            min={0}
            max={1}
            step={0.01}
            value={values[opacityKey]}
            setValue={(value) => setFieldValue(opacityKey, value)}
          />
        </Grid>
      </Grid>
      {extraChildren}
    </Box>
  );
};
