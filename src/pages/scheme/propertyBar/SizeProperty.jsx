import React, { useState } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps } from "constant";
import Helper from "helper";

import {
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Link as LinkIcon,
  LinkOff as LinkOfficon,
} from "@material-ui/icons";

const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;
const CustomIconButton = styled(IconButton)`
  margin: 0 5px;
  height: 50px;
`;

const SizeProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    toggleLayerDataField,
    currentLayer,
    pressedKey,
  } = props;
  const [expanded, setExpanded] = useState(true);
  const pressingShiftKey = pressedKey === "shift";

  const handleChangeWidth = (event) => {
    let value = parseFloat(event.target.value) || 0;
    if (values.layer_data.sizeLocked) {
      setFieldValue(
        "layer_data.height",
        (value * currentLayer.layer_data.height) / currentLayer.layer_data.width
      );
    }
    setFieldValue("layer_data.width", parseFloat(event.target.value) || 0);
  };
  const handleChangeHeight = (event) => {
    let value = parseFloat(event.target.value) || 0;
    if (values.layer_data.sizeLocked) {
      setFieldValue(
        "layer_data.width",
        (value * currentLayer.layer_data.width) / currentLayer.layer_data.height
      );
    }
    setFieldValue("layer_data.height", parseFloat(event.target.value) || 0);
  };
  const handleChangeScaleX = (event) => {
    let value = parseFloat(event.target.value) || 0;
    if (values.layer_data.scaleLocked) {
      setFieldValue(
        "layer_data.scaleY",
        (value * currentLayer.layer_data.scaleY) /
          currentLayer.layer_data.scaleX
      );
    }
    setFieldValue("layer_data.scaleX", parseFloat(event.target.value) || 0);
  };
  const handleChangeScaleY = (event) => {
    let value = parseFloat(event.target.value) || 0;
    if (values.layer_data.scaleLocked) {
      setFieldValue(
        "layer_data.scaleX",
        (value * currentLayer.layer_data.scaleX) /
          currentLayer.layer_data.scaleY
      );
    }
    setFieldValue("layer_data.scaleY", parseFloat(event.target.value) || 0);
  };

  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.width") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.height") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.scaleX") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.scaleY")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Size</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.width"
            ) ? (
              <CustomeTextField
                name="layer_data.width"
                label="Width"
                variant="outlined"
                type="number"
                value={Helper.mathRound2(values.layer_data.width)}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.width &&
                    errors.layer_data &&
                    errors.layer_data.width
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.width &&
                  errors.layer_data &&
                  errors.layer_data.width
                }
                onBlur={handleBlur}
                onChange={handleChangeWidth}
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.width"
            ) &&
            AllowedLayerProps[values.layer_type].includes(
              "layer_data.height"
            ) ? (
              <CustomIconButton
                onClick={() => toggleLayerDataField("sizeLocked")}
              >
                {values.layer_data.sizeLocked || pressingShiftKey ? (
                  <LinkIcon />
                ) : (
                  <LinkOfficon />
                )}
              </CustomIconButton>
            ) : (
              <></>
            )}
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.height"
            ) ? (
              <CustomeTextField
                name="layer_data.height"
                label="Height"
                variant="outlined"
                type="number"
                value={Helper.mathRound2(values.layer_data.height)}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.height &&
                    errors.layer_data &&
                    errors.layer_data.height
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.height &&
                  errors.layer_data &&
                  errors.layer_data.height
                }
                onBlur={handleBlur}
                onChange={handleChangeHeight}
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
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.scaleX"
            ) ? (
              <CustomeTextField
                name="layer_data.scaleX"
                label="ScaleX"
                variant="outlined"
                type="number"
                value={Helper.mathRound2(values.layer_data.scaleX)}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.scaleX &&
                    errors.layer_data &&
                    errors.layer_data.scaleX
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.scaleX &&
                  errors.layer_data &&
                  errors.layer_data.scaleX
                }
                onBlur={handleBlur}
                onChange={handleChangeScaleX}
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.scaleX"
            ) &&
            AllowedLayerProps[values.layer_type].includes(
              "layer_data.scaleY"
            ) ? (
              <CustomIconButton
                onClick={() => toggleLayerDataField("scaleLocked")}
              >
                {values.layer_data.scaleLocked || pressingShiftKey ? (
                  <LinkIcon />
                ) : (
                  <LinkOfficon />
                )}
              </CustomIconButton>
            ) : (
              <></>
            )}
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.scaleY"
            ) ? (
              <CustomeTextField
                name="layer_data.scaleY"
                label="ScaleY"
                variant="outlined"
                type="number"
                value={Helper.mathRound2(values.layer_data.scaleY)}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.scaleY &&
                    errors.layer_data &&
                    errors.layer_data.scaleY
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.scaleY &&
                  errors.layer_data &&
                  errors.layer_data.scaleY
                }
                onBlur={handleBlur}
                onChange={handleChangeScaleY}
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SizeProperty;
