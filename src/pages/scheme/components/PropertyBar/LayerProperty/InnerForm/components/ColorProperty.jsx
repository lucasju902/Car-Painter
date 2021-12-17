import React, { useState, useMemo, useCallback } from "react";

import { AllowedLayerProps, LayerTypes, FinishOptions } from "constant";

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

import { ColorPickerInput } from "components/common";

export const ColorProperty = React.memo((props) => {
  const {
    editable,
    currentCarMake,
    errors,
    isValid,
    checkLayerDataDirty,
    setFieldValue,
    values,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["color", "blendType", "finish"];
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

  const handleColorInstantChange = useCallback(
    (color) => onLayerDataUpdate("color", color),
    [onLayerDataUpdate]
  );

  const handleColorChange = useCallback(
    (color) => setFieldValue("layer_data.color", color),
    [setFieldValue]
  );

  if (
    !(
      AllowedLayerTypes.includes("layer_data.color") ||
      AllowedLayerTypes.includes("layer_data.blendType") ||
      (AllowedLayerTypes.includes("layer_data.finish") &&
        currentCarMake.car_type !== "Misc")
    )
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Colors</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.color") &&
          values.layer_type !== LayerTypes.TEXT ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box height="100%" display="flex" alignItems="center">
                  <Typography color="textSecondary" mr={2}>
                    Color
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.color}
                  disabled={!editable}
                  onChange={handleColorInstantChange}
                  onInputChange={handleColorChange}
                  error={Boolean(errors.layer_data && errors.layer_data.color)}
                  helperText={errors.layer_data && errors.layer_data.color}
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.blendType") ? (
            <Grid container spacing={2} component={Box} mb={1}>
              <Grid item xs={6}>
                <Box height="100%" display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary" mr={2}>
                    Blend Type
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Select
                  name="layer_data.blendType"
                  variant="outlined"
                  value={values.layer_data.blendType}
                  disabled={!editable}
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
          {AllowedLayerTypes.includes("layer_data.finish") &&
          currentCarMake.car_type !== "Misc" ? (
            <Grid container spacing={2} component={Box} mb={1}>
              <Grid item xs={6}>
                <Box height="100%" display="flex" alignItems="center">
                  <Typography variant="body1" color="textSecondary" mr={2}>
                    Finish
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Select
                  name="layer_data.finish"
                  variant="outlined"
                  value={values.layer_data.finish}
                  disabled={!editable}
                  onChange={(event) =>
                    onLayerDataUpdate("finish", event.target.value)
                  }
                  fullWidth
                >
                  {FinishOptions.map((finishItem, index) => (
                    <MenuItem value={finishItem.value} key={index}>
                      {finishItem.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {editable && isValid && checkLayerDataDirty(layerDataProperties) ? (
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
});
