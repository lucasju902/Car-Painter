import React, { useCallback } from "react";

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

  const handleColorChange = useCallback(
    (color) => setFieldValue(colorKey, color),
    [colorKey, setFieldValue]
  );

  const handleOpacityChange = useCallback(
    (value) => setFieldValue(opacityKey, value),
    [opacityKey, setFieldValue]
  );

  return (
    <Box display="flex" flexDirection="column" width="100%" mb={1}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Grid
            container
            spacing={2}
            component={Box}
            display="flex"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary" mr={2}>
                Color
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <ColorPickerInput
                value={values[colorKey]}
                onChange={handleColorChange}
                onInputChange={handleColorChange}
                error={Boolean(errors[colorKey])}
                helperText={errors[colorKey]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Opacity"
            min={0}
            max={1}
            step={0.01}
            value={values[opacityKey]}
            setValue={handleOpacityChange}
          />
        </Grid>
        {extraChildren}
      </Grid>
    </Box>
  );
};
