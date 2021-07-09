import React, { useState, useMemo } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";
import { mathRound2 } from "helper";

import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

const CornerProperty = (props) => {
  const {
    errors,
    isValid,
    checkLayerDataDirty,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  const layerDataProperties = [
    "cornerTopLeft",
    "cornerTopRight",
    "cornerBottomLeft",
    "cornerBottomRight",
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

  if (
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Corner Radius</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerTopLeft") ? (
                <CustomeTextField
                  name="layer_data.cornerTopLeft"
                  label="Top Left"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.cornerTopLeft)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerTopLeft &&
                      errors.layer_data &&
                      errors.layer_data.cornerTopLeft
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerTopLeft &&
                    errors.layer_data &&
                    errors.layer_data.cornerTopLeft
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerTopRight") ? (
                <CustomeTextField
                  name="layer_data.cornerTopRight"
                  label="Top Right"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.cornerTopRight)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerTopRight &&
                      errors.layer_data &&
                      errors.layer_data.cornerTopRight
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerTopRight &&
                    errors.layer_data &&
                    errors.layer_data.cornerTopRight
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerBottomLeft") ? (
                <CustomeTextField
                  name="layer_data.cornerBottomLeft"
                  label="Bottom Left"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.cornerBottomLeft)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerBottomLeft &&
                      errors.layer_data &&
                      errors.layer_data.cornerBottomLeft
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerBottomLeft &&
                    errors.layer_data &&
                    errors.layer_data.cornerBottomLeft
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
            <Grid item xs={6}>
              {AllowedLayerTypes.includes("layer_data.cornerBottomRight") ? (
                <CustomeTextField
                  name="layer_data.cornerBottomRight"
                  label="Bottom Right"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.cornerBottomRight)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.cornerBottomRight &&
                      errors.layer_data &&
                      errors.layer_data.cornerBottomRight
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.cornerBottomRight &&
                    errors.layer_data &&
                    errors.layer_data.cornerBottomRight
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

export default React.memo(CornerProperty);
