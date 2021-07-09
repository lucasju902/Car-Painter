import React, { useState, useMemo } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import ColorPickerInput from "components/ColorPickerInput";
import SliderInput from "components/SliderInput";

const ColorProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    isValid,
    checkLayerDataDirty,
    setFieldValue,
    touched,
    values,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["color", "opacity", "blendType"];
  const [expanded, setExpanded] = useState(true);
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );

  if (
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Colors</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.color") &&
          values.layer_type !== LayerTypes.TEXT ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.color}
                  onChange={(color) => onLayerDataUpdate("color", color)}
                  onInputChange={(color) =>
                    setFieldValue("layer_data.color", color)
                  }
                  error={Boolean(errors.layer_data && errors.layer_data.color)}
                  helperText={errors.layer_data && errors.layer_data.color}
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.opacity") ? (
            <Box mb={2}>
              <SliderInput
                label="Opacity"
                min={0}
                max={1}
                step={0.01}
                value={values.layer_data.opacity}
                setValue={(value) => setFieldValue("layer_data.opacity", value)}
              />
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.blendType") ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Blend Type
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Select
                  name="layer_data.blendType"
                  variant="outlined"
                  value={values.layer_data.blendType}
                  onChange={(event) =>
                    onLayerDataUpdate("blendType", event.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="normal">Normal</MenuItem>

                  <MenuItem value="multiply">Multiply</MenuItem>
                  <MenuItem value="darken">Darken</MenuItem>
                  <MenuItem value="lighten">Lighten</MenuItem>
                  <MenuItem value="color-burn">Color Burn</MenuItem>
                  <MenuItem value="color">Color</MenuItem>
                  <MenuItem value="screen">Screen</MenuItem>
                  <MenuItem value="overlay">Overlay</MenuItem>
                  <MenuItem value="hue">Hue</MenuItem>
                  <MenuItem value="saturation">Saturation</MenuItem>
                  <MenuItem value="luminosity">Luminosity</MenuItem>
                  <MenuItem value="xor">Xor</MenuItem>
                </Select>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {isValid && checkLayerDataDirty(layerDataProperties) ? (
            <Box mt={2} width="100%">
              <Button
                type="submit"
                color="primary"
                variant="outlined"
                fullWidth
              >
                Apply
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(ColorProperty);
