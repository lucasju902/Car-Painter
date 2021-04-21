import React, { useState } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
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

  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.left") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.top")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Position</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerProps[values.layer_type].includes("layer_data.left") ? (
            <CustomeTextField
              name="layer_data.left"
              label="Left"
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
          {AllowedLayerProps[values.layer_type].includes("layer_data.top") ? (
            <CustomeTextField
              name="layer_data.top"
              label="Top"
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PositionProperty;
