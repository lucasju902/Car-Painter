import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes, MouseModes } from "constant";
import { mathRound2 } from "helper";

import {
  Box,
  Button,
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

export const SizeProperty = React.memo((props) => {
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
    toggleLayerDataField,
    currentLayer,
    pressedKey,
  } = props;
  const layerDataProperties = [
    "width",
    "height",
    "scaleX",
    "scaleY",
    "radius",
    "innerRadius",
    "outerRadius",
    "pointerLength",
    "pointerWidth",
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
  const pressingShiftKey = useMemo(() => pressedKey === "shift", [pressedKey]);

  const handleChangeWidth = useCallback(
    (event) => {
      let value = parseFloat(event.target.value) || 0;
      if (values.layer_data.sizeLocked) {
        setFieldValue(
          "layer_data.height",
          (value * currentLayer.layer_data.height) /
            currentLayer.layer_data.width
        );
      }
      setFieldValue("layer_data.width", parseFloat(event.target.value) || 0);
    },
    [
      setFieldValue,
      currentLayer && currentLayer.layer_data.height,
      currentLayer && currentLayer.layer_data.width,
    ]
  );
  const handleChangeHeight = useCallback(
    (event) => {
      let value = parseFloat(event.target.value) || 0;
      if (values.layer_data.sizeLocked) {
        setFieldValue(
          "layer_data.width",
          (value * currentLayer.layer_data.width) /
            currentLayer.layer_data.height
        );
      }
      setFieldValue("layer_data.height", parseFloat(event.target.value) || 0);
    },
    [
      setFieldValue,
      currentLayer && currentLayer.layer_data.height,
      currentLayer && currentLayer.layer_data.width,
    ]
  );
  const handleChangeScaleX = useCallback(
    (event) => {
      let value = parseFloat(event.target.value) || 0;
      if (values.layer_data.sizeLocked) {
        setFieldValue(
          "layer_data.scaleY",
          (value * currentLayer.layer_data.scaleY) /
            currentLayer.layer_data.scaleX
        );
      }
      setFieldValue("layer_data.scaleX", parseFloat(event.target.value) || 0);
    },
    [
      setFieldValue,
      currentLayer && currentLayer.layer_data.scaleY,
      currentLayer && currentLayer.layer_data.scaleX,
    ]
  );
  const handleChangeScaleY = useCallback(
    (event) => {
      let value = parseFloat(event.target.value) || 0;
      if (values.layer_data.sizeLocked) {
        setFieldValue(
          "layer_data.scaleX",
          (value * currentLayer.layer_data.scaleX) /
            currentLayer.layer_data.scaleY
        );
      }
      setFieldValue("layer_data.scaleY", parseFloat(event.target.value) || 0);
    },
    [
      setFieldValue,
      currentLayer && currentLayer.layer_data.scaleY,
      currentLayer && currentLayer.layer_data.scaleX,
    ]
  );

  const handleChangeInnerRadius = useCallback(
    (event) => {
      let value = parseFloat(event.target.value) || 0;
      if (values.layer_data.sizeLocked) {
        setFieldValue(
          "layer_data.outerRadius",
          (value * currentLayer.layer_data.outerRadius) /
            currentLayer.layer_data.innerRadius
        );
      }
      setFieldValue(
        "layer_data.innerRadius",
        parseFloat(event.target.value) || 0
      );
    },
    [
      setFieldValue,
      currentLayer && currentLayer.layer_data.outerRadius,
      currentLayer && currentLayer.layer_data.innerRadius,
    ]
  );
  const handleChangeOuterRadius = useCallback(
    (event) => {
      let value = parseFloat(event.target.value) || 0;
      if (values.layer_data.sizeLocked) {
        setFieldValue(
          "layer_data.innerRadius",
          (value * currentLayer.layer_data.innerRadius) /
            currentLayer.layer_data.outerRadius
        );
      }
      setFieldValue(
        "layer_data.outerRadius",
        parseFloat(event.target.value) || 0
      );
    },
    [
      setFieldValue,
      currentLayer && currentLayer.layer_data.outerRadius,
      currentLayer && currentLayer.layer_data.innerRadius,
    ]
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
            {AllowedLayerTypes.includes("layer_data.width") ? (
              <CustomeTextField
                name="layer_data.width"
                label={
                  values.layer_data.type !== MouseModes.ELLIPSE
                    ? "Width"
                    : "RadiusX"
                }
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.width)}
                disabled={!editable}
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
            {AllowedLayerTypes.includes("layer_data.width") &&
            AllowedLayerTypes.includes("layer_data.height") ? (
              <CustomIconButton
                disabled={!editable}
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
            {AllowedLayerTypes.includes("layer_data.height") ? (
              <CustomeTextField
                name="layer_data.height"
                label={
                  values.layer_data.type !== MouseModes.ELLIPSE
                    ? "Height"
                    : "RadiusY"
                }
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.height)}
                disabled={!editable}
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
            {AllowedLayerTypes.includes("layer_data.scaleX") ? (
              <CustomeTextField
                name="layer_data.scaleX"
                label="ScaleX"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.scaleX)}
                disabled={!editable}
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
            {AllowedLayerTypes.includes("layer_data.scaleX") &&
            AllowedLayerTypes.includes("layer_data.scaleY") ? (
              <CustomIconButton
                disabled={!editable}
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
            {AllowedLayerTypes.includes("layer_data.scaleY") ? (
              <CustomeTextField
                name="layer_data.scaleY"
                label="ScaleY"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.scaleY)}
                disabled={!editable}
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
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            {AllowedLayerTypes.includes("layer_data.innerRadius") ? (
              <CustomeTextField
                name="layer_data.innerRadius"
                label="Inner Radius"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.innerRadius)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.innerRadius &&
                    errors.layer_data &&
                    errors.layer_data.innerRadius
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.innerRadius &&
                  errors.layer_data &&
                  errors.layer_data.innerRadius
                }
                onBlur={handleBlur}
                onChange={handleChangeInnerRadius}
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
            {AllowedLayerTypes.includes("layer_data.innerRadius") &&
            AllowedLayerTypes.includes("layer_data.outerRadius") ? (
              <CustomIconButton
                disabled={!editable}
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
            {AllowedLayerTypes.includes("layer_data.outerRadius") ? (
              <CustomeTextField
                name="layer_data.outerRadius"
                label="Outer Radius"
                variant="outlined"
                type="number"
                value={mathRound2(values.layer_data.outerRadius)}
                disabled={!editable}
                error={Boolean(
                  touched.layer_data &&
                    touched.layer_data.outerRadius &&
                    errors.layer_data &&
                    errors.layer_data.outerRadius
                )}
                helperText={
                  touched.layer_data &&
                  touched.layer_data.outerRadius &&
                  errors.layer_data &&
                  errors.layer_data.outerRadius
                }
                onBlur={handleBlur}
                onChange={handleChangeOuterRadius}
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
          {AllowedLayerTypes.includes("layer_data.radius") ? (
            <CustomeTextField
              name="layer_data.radius"
              label="Radius"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.radius)}
              disabled={!editable}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.radius &&
                  errors.layer_data &&
                  errors.layer_data.radius
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.radius &&
                errors.layer_data &&
                errors.layer_data.radius
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
          {AllowedLayerTypes.includes("layer_data.pointerWidth") ? (
            <CustomeTextField
              name="layer_data.pointerWidth"
              label="Pointer Width"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.pointerWidth)}
              disabled={!editable}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.pointerWidth &&
                  errors.layer_data &&
                  errors.layer_data.pointerWidth
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.pointerWidth &&
                errors.layer_data &&
                errors.layer_data.pointerWidth
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
          {AllowedLayerTypes.includes("layer_data.pointerLength") ? (
            <CustomeTextField
              name="layer_data.pointerLength"
              label="Pointer Length"
              variant="outlined"
              type="number"
              value={mathRound2(values.layer_data.pointerLength)}
              disabled={!editable}
              error={Boolean(
                touched.layer_data &&
                  touched.layer_data.pointerLength &&
                  errors.layer_data &&
                  errors.layer_data.pointerLength
              )}
              helperText={
                touched.layer_data &&
                touched.layer_data.pointerLength &&
                errors.layer_data &&
                errors.layer_data.pointerLength
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
