import React, { useState, useMemo, useCallback } from "react";

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

import { ColorPickerInput, SliderInput } from "components/common";
import { LabelTypography } from "../../../PropertyBar.style";
import { focusBoardQuickly } from "helper";

export const StrokeProperty = React.memo((props) => {
  const {
    editable,
    errors,
    isValid,
    checkLayerDataDirty,
    setFieldValue,
    values,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["stroke", "scolor", "strokeType"];
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

  const handleChangeStrokeWidth = useCallback(
    (value) => setFieldValue("layer_data.stroke", value),
    [setFieldValue]
  );

  const handleChangeScolorInstantly = useCallback(
    (color) => onLayerDataUpdate("scolor", color),
    [onLayerDataUpdate]
  );

  const handleChangeScolorOnly = useCallback(
    (color) => setFieldValue("layer_data.scolor", color),
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
        <Typography variant="subtitle1">Stroke</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.scolor") ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid
                container
                component={Box}
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item xs={6}>
                  <LabelTypography variant="body1" color="textSecondary" mr={2}>
                    Stroke Color
                  </LabelTypography>
                </Grid>
                <Grid item xs={6}>
                  <ColorPickerInput
                    value={values.layer_data.scolor}
                    disabled={!editable}
                    onChange={handleChangeScolorInstantly}
                    onInputChange={handleChangeScolorOnly}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.scolor
                    )}
                    helperText={errors.layer_data && errors.layer_data.scolor}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.stroke") ? (
            <Box display="flex" alignItems="center" height="40px">
              <SliderInput
                label="Stroke Width"
                min={0}
                max={10}
                small
                value={values.layer_data.stroke}
                disabled={!editable}
                setValue={handleChangeStrokeWidth}
              />
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.strokeType") ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <LabelTypography variant="body1" color="textSecondary" mr={2}>
                    Stroke Type
                  </LabelTypography>
                </Grid>
                <Grid item xs={6}>
                  <Select
                    name="layer_data.strokeType"
                    variant="outlined"
                    value={values.layer_data.strokeType}
                    disabled={!editable}
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
            </Box>
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
