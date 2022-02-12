import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Button,
  FormControl as MuiFormControl,
  Typography,
  InputLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { FontSelect, ColorPickerInput, SliderInput } from "components/common";

const FormControl = styled(MuiFormControl)(spacing);

export const FontProperty = React.memo((props) => {
  const {
    editable,
    errors,
    isValid,
    checkLayerDataDirty,
    setFieldValue,
    values,
    fontList,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["font", "size"];
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

  const handleChangeFont = useCallback(
    (fontID) => onLayerDataUpdate("font", fontID),
    [onLayerDataUpdate]
  );

  const handleChangeSize = useCallback(
    (value) => setFieldValue("layer_data.size", value),
    [setFieldValue]
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
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Font</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.font") ? (
            <FormControl variant="outlined" mt={2}>
              <InputLabel id="font-select-label">Font</InputLabel>
              <FontSelect
                value={values.layer_data.font}
                disabled={!editable}
                onChange={handleChangeFont}
                fontList={fontList}
              />
            </FormControl>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.color") ? (
            <Grid container spacing={2} component={Box} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Font Color
                </Typography>
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
          {AllowedLayerTypes.includes("layer_data.size") ? (
            <SliderInput
              label="Font Size"
              disabled={!editable}
              min={6}
              max={512}
              value={values.layer_data.size}
              setValue={handleChangeSize}
            />
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
