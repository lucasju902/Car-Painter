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
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import SliderInput from "components/SliderInput";

const RotationProperty = (props) => {
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
          <Box display="flex" justifyContent="space-around">
            {AllowedLayerTypes.includes("layer_data.flop") ? (
              <FormControl component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={Boolean(values.layer_data.flop)}
                      onChange={(event) =>
                        setFieldValue(
                          "layer_data.flop",
                          event.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="Flop"
                  labelPlacement="start"
                />
              </FormControl>
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.flip") ? (
              <FormControl component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={Boolean(values.layer_data.flip)}
                      onChange={(event) =>
                        setFieldValue(
                          "layer_data.flip",
                          event.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label="Flip"
                  labelPlacement="start"
                />
              </FormControl>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RotationProperty;
