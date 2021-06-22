import React, { useState, useMemo } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Button,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import ColorPickerInput from "components/ColorPickerInput";
import SliderInput from "components/SliderInput";

const StrokeProperty = (props) => {
  const {
    errors,
    isValid,
    checkLayerDataDirty,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["stroke", "scolor", "strokeType"];
  const [expanded, setExpanded] = useState(true);
  const AllowedLayerTypes = useMemo(
    () =>
      values.layer_type !== LayerTypes.SHAPE
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
        <Typography>Stroke</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.scolor") ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Stroke Color
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ColorPickerInput
                  value={values.layer_data.scolor}
                  onChange={(color) => onLayerDataUpdate("scolor", color)}
                  onInputChange={(color) =>
                    setFieldValue("layer_data.scolor", color)
                  }
                  error={Boolean(errors.layer_data && errors.layer_data.scolor)}
                  helperText={errors.layer_data && errors.layer_data.scolor}
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.stroke") ? (
            <Box mb={2}>
              <SliderInput
                label="Stroke Width"
                min={0}
                max={10}
                value={values.layer_data.stroke}
                setValue={(value) => setFieldValue("layer_data.stroke", value)}
              />
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.strokeType") ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Stroke Type
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Select
                  name="layer_data.strokeType"
                  variant="outlined"
                  value={values.layer_data.strokeType}
                  onChange={(event) =>
                    onLayerDataUpdate("strokeType", event.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="inside">Inside</MenuItem>
                  <MenuItem value="middle">Middle</MenuItem>
                  <MenuItem value="outside">Outside</MenuItem>
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

export default React.memo(StrokeProperty);
