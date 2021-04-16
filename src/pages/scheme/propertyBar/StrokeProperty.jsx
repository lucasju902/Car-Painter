import React, { useState } from "react";

import { AllowedLayerProps } from "constant";

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

const StrokeProperty = (props) => {
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
    !AllowedLayerProps[values.layer_type].includes("layer_data.stroke") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.scolor")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Stroke</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.scolor"
          ) ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Stroke Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.scolor}
                  onChange={(color) =>
                    setFieldValue("layer_data.scolor", color)
                  }
                  onInputChange={(color) =>
                    setFieldValue("layer_data.scolor", color)
                  }
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.scolor &&
                      errors.layer_data &&
                      errors.layer_data.scolor
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.scolor &&
                    errors.layer_data &&
                    errors.layer_data.scolor
                  }
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.stroke"
          ) ? (
            <SliderInput
              label="Stroke Width"
              min={0}
              max={10}
              value={values.layer_data.stroke}
              setValue={(value) => setFieldValue("layer_data.stroke", value)}
            />
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default StrokeProperty;
