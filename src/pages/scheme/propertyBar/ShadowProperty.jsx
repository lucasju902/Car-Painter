import React, { useState } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import ColorPickerInput from "components/ColorPickerInput";
import SliderInput from "components/SliderInput";

const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

const ShadowProperty = (props) => {
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
    !AllowedLayerProps[values.layer_type].includes("layer_data.shadowColor") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.shadowBlur") &&
    !AllowedLayerProps[values.layer_type].includes(
      "layer_data.shadowOpacity"
    ) &&
    !AllowedLayerProps[values.layer_type].includes(
      "layer_data.shadowOffsetX"
    ) &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.shadowOffsetY")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Shadow</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.shadowColor"
          ) ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Shadow Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.shadowColor}
                  onChange={(color) =>
                    setFieldValue("layer_data.shadowColor", color)
                  }
                  onInputChange={(color) =>
                    setFieldValue("layer_data.shadowColor", color)
                  }
                  error={Boolean(
                    errors.layer_data && errors.layer_data.shadowColor
                  )}
                  helperText={
                    errors.layer_data && errors.layer_data.shadowColor
                  }
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.shadowBlur"
          ) ? (
            <CustomeTextField
              name="layer_data.shadowBlur"
              label="Shadow Blur"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.shadowBlur)}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.shadowBlur &&
                  errors.layer_data &&
                  errors.layer_data.shadowBlur
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.shadowBlur &&
                errors.layer_data &&
                errors.layer_data.shadowBlur
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
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.shadowOpacity"
          ) ? (
            <SliderInput
              label="Shadow Opacity"
              min={0}
              max={1}
              step={0.01}
              value={values.layer_data.shadowOpacity}
              setValue={(value) =>
                setFieldValue("layer_data.shadowOpacity", value)
              }
            />
          ) : (
            <></>
          )}
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.shadowOffsetX"
          ) ? (
            <CustomeTextField
              name="layer_data.shadowOffsetX"
              label="Shadow OffsetX"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.shadowOffsetX)}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.shadowOffsetX &&
                  errors.layer_data &&
                  errors.layer_data.shadowOffsetX
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.shadowOffsetX &&
                errors.layer_data &&
                errors.layer_data.shadowOffsetX
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
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.shadowOffsetY"
          ) ? (
            <CustomeTextField
              name="layer_data.shadowOffsetY"
              label="Shadow OffsetY"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.shadowOffsetY)}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.shadowOffsetY &&
                  errors.layer_data &&
                  errors.layer_data.shadowOffsetY
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.shadowOffsetY &&
                errors.layer_data &&
                errors.layer_data.shadowOffsetY
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
      </AccordionDetails>
    </Accordion>
  );
};

export default ShadowProperty;
