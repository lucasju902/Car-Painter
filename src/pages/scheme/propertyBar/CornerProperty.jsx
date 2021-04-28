import React, { useState } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, MouseModes } from "constant";
import { mathRound2 } from "helper";

import {
  Grid,
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
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  const [expanded, setExpanded] = useState(true);
  console.log(values.layer_data.type);
  if (
    (!AllowedLayerProps[values.layer_type].includes(
      "layer_data.cornerTopLeft"
    ) &&
      !AllowedLayerProps[values.layer_type].includes(
        "layer_data.cornerTopRight"
      ) &&
      !AllowedLayerProps[values.layer_type].includes(
        "layer_data.cornerBottomLeft"
      ) &&
      !AllowedLayerProps[values.layer_type].includes(
        "layer_data.cornerBottomRight"
      )) ||
    values.layer_data.type !== MouseModes.RECT
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Corner Radius</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.cornerTopLeft"
            ) ? (
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.cornerTopRight"
            ) ? (
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.cornerBottomLeft"
            ) ? (
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.cornerBottomRight"
            ) ? (
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
      </AccordionDetails>
    </Accordion>
  );
};

export default CornerProperty;
