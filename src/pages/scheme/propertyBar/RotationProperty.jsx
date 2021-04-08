import React, { useState } from "react";

import { AllowedLayerProps } from "constant";

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

  if (
    !AllowedLayerProps[values.layer_type].includes("layer_data.rotation") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.flip") &&
    !AllowedLayerProps[values.layer_type].includes("layer_data.flop")
  )
    return <></>;
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Rotation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {AllowedLayerProps[values.layer_type].includes(
            "layer_data.rotation"
          ) ? (
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.flop"
            ) ? (
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
            {AllowedLayerProps[values.layer_type].includes(
              "layer_data.flip"
            ) ? (
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
