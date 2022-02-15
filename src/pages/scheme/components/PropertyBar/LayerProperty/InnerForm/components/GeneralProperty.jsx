import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core";
import { SliderInput } from "components/common";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";

const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

export const GeneralProperty = React.memo((props) => {
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
    toggleField,
  } = props;
  const layerDataProperties = ["text", "numPoints", "angle", "opacity"];
  const layerProperties = ["layer_visible", "layer_locked"];
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

  const handleChangeAngle = useCallback(
    (value) => setFieldValue("layer_data.angle", value),
    [setFieldValue]
  );

  const handleChangeOpacity = useCallback(
    (value) => setFieldValue("layer_data.opacity", value),
    [setFieldValue]
  );

  if (
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    ) &&
    layerProperties.every((value) => !AllowedLayerTypes.includes(value))
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {AllowedLayerTypes.includes("layer_data.text") ? (
            <Grid item xs={12} sm={12}>
              <CustomeTextField
                name="layer_data.text"
                label="Text"
                variant="outlined"
                value={values.layer_data.text}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.text &&
                    errors.layer_data &&
                    errors.layer_data.text
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.text &&
                  errors.layer_data &&
                  errors.layer_data.text
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
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.numPoints") ? (
            <Grid item xs={12} sm={12}>
              <CustomeTextField
                name="layer_data.numPoints"
                label="Number of Points"
                variant="outlined"
                type="number"
                value={Math.round(values.layer_data.numPoints)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.numPoints &&
                    errors.layer_data &&
                    errors.layer_data.numPoints
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.numPoints &&
                  errors.layer_data &&
                  errors.layer_data.numPoints
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
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.angle") ? (
            <Grid item xs={12} sm={12} component={Box} height="48px">
              <SliderInput
                label="Angle"
                disabled={!editable}
                min={0}
                max={360}
                value={Math.round(values.layer_data.angle)}
                setValue={handleChangeAngle}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.opacity") ? (
            <Grid item xs={12} sm={12} component={Box} height="48px">
              <SliderInput
                label="Opacity"
                disabled={!editable}
                min={0}
                max={1}
                step={0.01}
                value={values.layer_data.opacity}
                setValue={handleChangeOpacity}
              />
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_visible") ? (
            <Grid item xs={12} sm={12} component={Box} height="48px">
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                height="40px"
              >
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Visibility
                </Typography>
                <IconButton
                  disabled={!editable}
                  onClick={() => toggleField("layer_visible")}
                  size="small"
                >
                  {values.layer_visible ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_locked") ? (
            <Grid
              item
              xs={12}
              sm={12}
              component={Box}
              height="48px"
              alignItems="center"
            >
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                height="40px"
              >
                <Typography variant="body1" color="textSecondary" mr={2}>
                  Locking
                </Typography>
                <IconButton
                  disabled={!editable}
                  onClick={() => toggleField("layer_locked")}
                  size="small"
                >
                  {values.layer_locked ? <LockIcon /> : <LockOpenIcon />}
                </IconButton>
              </Box>
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
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});
