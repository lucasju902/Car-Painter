import React, { useState, useMemo } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
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

export const PositionProperty = React.memo((props) => {
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
  } = props;
  const layerDataProperties = ["left", "top"];
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
        <Typography variant="subtitle1">Position</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={2}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.left") ? (
                <CustomeTextField
                  name="layer_data.left"
                  label="X"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.left)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.left &&
                      errors.layer_data &&
                      errors.layer_data.left
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.left &&
                    errors.layer_data &&
                    errors.layer_data.left
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
              {AllowedLayerTypes.includes("layer_data.top") ? (
                <CustomeTextField
                  name="layer_data.top"
                  label="Y"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.top)}
                  disabled={!editable}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.top &&
                      errors.layer_data &&
                      errors.layer_data.top
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.top &&
                    errors.layer_data &&
                    errors.layer_data.top
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
