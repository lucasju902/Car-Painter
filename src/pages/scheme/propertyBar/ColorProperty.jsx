import React, { useState } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Typography,
  Grid,
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
    setFieldValue,
    touched,
    values,
  } = props;
  const [expanded, setExpanded] = useState(true);

  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.color") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.opacity")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Color/Opacity</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerProps[values.layer_type].includes("layer_data.color") &&
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
                  onChange={(color) => setFieldValue("layer_data.color", color)}
                  onInputChange={(color) =>
                    setFieldValue("layer_data.color", color)
                  }
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.opacity"
          ) ? (
            <SliderInput
              label="Opacity"
              min={0}
              max={1}
              step={0.01}
              value={values.layer_data.opacity}
              setValue={(value) => setFieldValue("layer_data.opacity", value)}
            />
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ColorProperty;
