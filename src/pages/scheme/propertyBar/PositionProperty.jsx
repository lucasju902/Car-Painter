import React, { useState, useMemo } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
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

const PositionProperty = (props) => {
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
    !AllowedLayerTypes.includes("layer_data.left") &&
    !AllowedLayerTypes.includes("layer_data.top")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Position</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              {AllowedLayerTypes.includes("layer_data.left") ? (
                <CustomeTextField
                  name="layer_data.left"
                  label="X"
                  variant="outlined"
                  type="number"
                  value={mathRound2(values.layer_data.left)}
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(PositionProperty);
