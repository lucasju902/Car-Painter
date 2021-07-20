import React, { useState, useMemo } from "react";
import styled from "styled-components/macro";

import { AllowedLayerProps, LayerTypes } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import ColorPickerInput from "components/ColorPickerInput";
const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

const BackgroundProperty = (props) => {
  const {
    editable,
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
  const layerDataProperties = ["bgColor", "paddingX", "paddingY"];
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
        <Typography>Background</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.bgColor") ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Background Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.bgColor}
                  disabled={!editable}
                  onChange={(color) => onLayerDataUpdate("bgColor", color)}
                  onInputChange={(color) =>
                    setFieldValue("layer_data.bgColor", color)
                  }
                  error={Boolean(
                    errors.layer_data && errors.layer_data.bgColor
                  )}
                  helperText={errors.layer_data && errors.layer_data.bgColor}
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          <Grid container spacing={1}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.paddingX") ? (
                <CustomeTextField
                  name="layer_data.paddingX"
                  label="PaddingX"
                  variant="outlined"
                  type="number"
                  disabled={!editable}
                  value={mathRound2(values.layer_data.paddingX)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.paddingX &&
                      errors.layer_data &&
                      errors.layer_data.paddingX
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.paddingX &&
                    errors.layer_data &&
                    errors.layer_data.paddingX
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
            </Grid>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.paddingY") ? (
                <CustomeTextField
                  name="layer_data.paddingY"
                  label="PaddingY"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.paddingY)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.paddingY &&
                      errors.layer_data &&
                      errors.layer_data.paddingY
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.paddingY &&
                    errors.layer_data &&
                    errors.layer_data.paddingY
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
            </Grid>
          </Grid>
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
};

export default React.memo(BackgroundProperty);
