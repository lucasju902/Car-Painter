import React, { useState, useMemo, useCallback } from "react";
import { AllowedLayerProps, LayerTypes } from "constant";
import { focusBoardQuickly, mathRound2 } from "helper";

import {
  Box,
  Button,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { ColorPickerInput, SliderInput } from "components/common";
import { LabelTypography, SmallTextField } from "../../../PropertyBar.style";

export const ShadowProperty = React.memo((props) => {
  const DefaultBlurToSet = 10;
  const {
    editable,
    errors,
    isValid,
    checkLayerDataDirty,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    onApply,
  } = props;
  const layerDataProperties = [
    "shadowColor",
    "shadowBlur",
    "shadowOpacity",
    "shadowOffsetX",
    "shadowOffsetY",
  ];
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

  const handleColorChange = useCallback(
    (value, applyNow = true) => {
      if (
        !values.layer_data.shadowColor ||
        values.layer_data.shadowColor === "transparent"
      ) {
        setFieldValue("layer_data.shadowBlur", DefaultBlurToSet);
      }
      setFieldValue("layer_data.shadowColor", value);
      if (applyNow) onApply(values);
    },
    [values, setFieldValue, onApply]
  );

  const handleColorChangeOnly = useCallback(
    (value) => handleColorChange(value, false),
    [handleColorChange]
  );

  const handleChangeShadowOpacity = useCallback(
    (value) => setFieldValue("layer_data.shadowOpacity", value),
    [setFieldValue]
  );

  if (
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        focusBoardQuickly();
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Shadow</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.shadowColor") ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <LabelTypography variant="body1" color="textSecondary" mr={2}>
                    Shadow Color
                  </LabelTypography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.shadowColor}
                  disabled={!editable}
                  onChange={handleColorChange}
                  onInputChange={handleColorChangeOnly}
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
          {AllowedLayerTypes.includes("layer_data.shadowOpacity") ? (
            <Box height="40px" display="flex" alignItems="center">
              <SliderInput
                label="Opacity"
                min={0}
                max={1}
                step={0.01}
                small
                value={values.layer_data.shadowOpacity}
                disabled={!editable}
                setValue={handleChangeShadowOpacity}
              />
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.shadowBlur") ? (
            <SmallTextField
              name="layer_data.shadowBlur"
              label="Shadow Blur"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.shadowBlur)}
              disabled={!editable}
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
          <Grid container spacing={2}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.shadowOffsetX") ? (
                <SmallTextField
                  name="layer_data.shadowOffsetX"
                  label="Offset (X)"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.shadowOffsetX)}
                  disabled={!editable}
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
            </Grid>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.shadowOffsetY") ? (
                <SmallTextField
                  name="layer_data.shadowOffsetY"
                  label="Offset (Y)"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.shadowOffsetY)}
                  disabled={!editable}
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
});
