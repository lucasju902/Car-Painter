import React, { useState, useMemo } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";

import SliderInput from "components/SliderInput";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
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

const GeneralProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    toggleField,
  } = props;

  const [expanded, setExpanded] = useState(true);
  const AllowedLayerTypes = useMemo(
    () =>
      values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );
  if (JSON.stringify(errors) !== "{}") {
    console.log(errors);
  }

  if (
    !AllowedLayerTypes.includes("layer_data.name") &&
    !AllowedLayerTypes.includes("layer_data.text") &&
    !AllowedLayerTypes.includes("layer_data.numPoints") &&
    !AllowedLayerTypes.includes("layer_data.angle")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.name") ? (
            <CustomeTextField
              name="layer_data.name"
              label="Name"
              variant="outlined"
              value={values.layer_data.name}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.name &&
                  errors.layer_data &&
                  errors.layer_data.name
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.name &&
                errors.layer_data &&
                errors.layer_data.name
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
          {AllowedLayerTypes.includes("layer_data.text") ? (
            <CustomeTextField
              name="layer_data.text"
              label="Text"
              variant="outlined"
              value={values.layer_data.text}
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
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.numPoints") ? (
            <CustomeTextField
              name="layer_data.numPoints"
              label="Number of Points"
              variant="outlined"
              type="number"
              value={Math.round(values.layer_data.numPoints)}
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
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.angle") ? (
            <SliderInput
              label="Angle"
              min={0}
              max={360}
              value={Math.round(values.layer_data.angle)}
              setValue={(value) => setFieldValue("layer_data.angle", value)}
            />
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_visible") ? (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" color="textSecondary" mr={2}>
                Visibility
              </Typography>
              <IconButton
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
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_locked") ? (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" color="textSecondary" mr={2}>
                Locking
              </Typography>
              <IconButton
                onClick={() => toggleField("layer_locked")}
                size="small"
              >
                {values.layer_locked ? <LockIcon /> : <LockOpenIcon />}
              </IconButton>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default GeneralProperty;
