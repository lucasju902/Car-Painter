import React, { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  Box,
  Typography,
  Grid,
} from "components/MaterialUI";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import SliderInput from "components/SliderInput";
import ColorPickerInput from "components/ColorPickerInput";
import { CustomAccordionSummary } from "./styles";

export const SubForm = (props) => {
  const {
    label,
    colorKey,
    opacityKey,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    extraChildren,
  } = props;
  const [expanded, setExpanded] = useState(true);
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label}</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%" mb={1}>
          <Grid container spacing={2}>
            {colorKey ? (
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
            ) : (
              <></>
            )}
            {opacityKey ? (
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
            ) : (
              <></>
            )}
          </Grid>
          {extraChildren}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
