import React, { useState, useMemo } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

const SkewProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  const [expanded, setExpanded] = useState(true);
  const AllowedLayerTypes = useMemo(
    () =>
      values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );

  if (
    !AllowedLayerTypes.includes("layer_data.skewX") &&
    !AllowedLayerTypes.includes("layer_data.skewY")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Skew</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.skewX") ? (
                <CustomeTextField
                  name="layer_data.skewX"
                  label="SkewX"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.skewX)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.skewX &&
                      errors.layer_data &&
                      errors.layer_data.skewX
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.skewX &&
                    errors.layer_data &&
                    errors.layer_data.skewX
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
              {AllowedLayerTypes.includes("layer_data.skewY") ? (
                <CustomeTextField
                  name="layer_data.skewY"
                  label="SkewY"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.skewY)}
                  error={Boolean(
                    touched.layer_data &&
                      touched.layer_data.skewY &&
                      errors.layer_data &&
                      errors.layer_data.skewY
                  )}
                  helperText={
                    touched.layer_data &&
                    touched.layer_data.skewY &&
                    errors.layer_data &&
                    errors.layer_data.skewY
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(SkewProperty);