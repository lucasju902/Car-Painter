import React, { useState, useMemo } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import {
  Box,
  Checkbox,
  Typography,
  FormControl,
  FormControlLabel,
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
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    toggleField,
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
    !AllowedLayerTypes.includes("layer_data.rotation") &&
    !AllowedLayerTypes.includes("layer_data.flip") &&
    !AllowedLayerTypes.includes("layer_data.flop")
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
              setValue={(value) => setFieldValue("layer_data.rotation", value)}
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
                onClick={() =>
                  setFieldValue(
                    "layer_data.flop",
                    values.layer_data.flop ? 0 : 1
                  )
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
                onClick={() =>
                  setFieldValue(
                    "layer_data.flip",
                    values.layer_data.flip ? 0 : 1
                  )
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(RotationProperty);
