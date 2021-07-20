import React, { useState, useMemo, useCallback } from "react";

import { AllowedLayerProps, LayerTypes, MouseModes } from "constant";
import { rotateAroundCenter } from "helper";

import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
} from "@material-ui/icons";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SliderInput from "components/SliderInput";

const RotationProperty = (props) => {
  const {
    editable,
    errors,
    isValid,
    checkLayerDataDirty,
    stageRef,
    currentLayer,
    handleBlur,
    handleChange,
    setFieldValue,
    toggleField,
    touched,
    values,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["rotation", "flip", "flop"];
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

  const handleChangeRotation = useCallback(
    (value) => {
      if (
        ![
          MouseModes.CIRCLE,
          MouseModes.ELLIPSE,
          MouseModes.STAR,
          MouseModes.RING,
          MouseModes.REGULARPOLYGON,
          MouseModes.WEDGE,
          MouseModes.ARC,
          MouseModes.ARROW,
          MouseModes.PEN,
        ].includes(currentLayer.layer_data.type)
      ) {
        const stage = stageRef.current;
        const selectedNode = stage.findOne("." + currentLayer.id);
        const newRot = (value / 180) * Math.PI;
        const boundBox = {
          x: selectedNode.x(),
          y: selectedNode.y(),
          width: selectedNode.width(),
          height: selectedNode.height(),
          rotation: (selectedNode.rotation() / 180) * Math.PI,
        };

        const newBoundBox = rotateAroundCenter(
          boundBox,
          newRot - boundBox.rotation
        );

        setFieldValue("layer_data.left", newBoundBox.x);
        setFieldValue("layer_data.top", newBoundBox.y);
      }
      setFieldValue("layer_data.rotation", value);
    },
    [currentLayer, rotateAroundCenter]
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
        <Typography>Rotation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerTypes.includes("layer_data.rotation") ? (
            <SliderInput
              label="Rotation"
              min={-179}
              max={179}
              value={Math.round(values.layer_data.rotation)}
              disabled={!editable}
              setValue={handleChangeRotation}
            />
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.flop") ? (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" color="textSecondary" mr={2}>
                Flop
              </Typography>
              <IconButton
                disabled={!editable}
                onClick={() =>
                  onLayerDataUpdate("flop", values.layer_data.flop ? 0 : 1)
                }
                size="small"
              >
                {values.layer_data.flop ? (
                  <SwapHorizIcon />
                ) : (
                  <>
                    <SwapHorizIcon />
                    <Box position="absolute" left="4px" top="5px">
                      <FontAwesomeIcon icon={faSlash} size="sm" />
                    </Box>
                  </>
                )}
              </IconButton>
            </Box>
          ) : (
            <></>
          )}
          {AllowedLayerTypes.includes("layer_data.flip") ? (
            <Box
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="body1" color="textSecondary" mr={2}>
                Flip
              </Typography>
              <IconButton
                disabled={!editable}
                onClick={() =>
                  onLayerDataUpdate("flip", values.layer_data.flip ? 0 : 1)
                }
                size="small"
              >
                {values.layer_data.flip ? (
                  <SwapVertIcon />
                ) : (
                  <>
                    <SwapVertIcon />
                    <Box position="absolute" left="4px" top="5px">
                      <FontAwesomeIcon icon={faSlash} size="sm" />
                    </Box>
                  </>
                )}
              </IconButton>
            </Box>
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
};

export default React.memo(RotationProperty);
