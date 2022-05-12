import React, { useState, useCallback } from "react";

import {
  Accordion,
  AccordionDetails,
  Box,
  Typography,
  Grid,
} from "components/MaterialUI";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { ColorPickerInput, SliderInput } from "components/common";
import { CustomAccordionSummary } from "./styles";
import { focusBoardQuickly } from "helper";

export const SubForm = React.memo((props) => {
  const {
    label,
    editable,
    colorKey,
    opacityKey,
    errors,
    setFieldValue,
    values,
    extraChildren,
  } = props;
  const [expanded, setExpanded] = useState(true);

  const handleChangeColor = useCallback(
    (color) => setFieldValue(colorKey, color),
    [colorKey, setFieldValue]
  );

  const handleChangeOpacity = useCallback(
    (value) => setFieldValue(opacityKey, value),
    [opacityKey, setFieldValue]
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        focusBoardQuickly();
      }}
    >
      <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{label}</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%" mb={1}>
          {colorKey || opacityKey ? (
            <Grid container spacing={2}>
              {colorKey ? (
                <Grid item xs={12} sm={6}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body1" color="textSecondary" mr={2}>
                      Color
                    </Typography>
                    <ColorPickerInput
                      disabled={!editable}
                      value={values[colorKey]}
                      onChange={handleChangeColor}
                      onInputChange={handleChangeColor}
                      error={Boolean(errors[colorKey])}
                      helperText={errors[colorKey]}
                    />
                  </Box>
                </Grid>
              ) : (
                <></>
              )}
              {opacityKey ? (
                <Grid item xs={12} sm={6}>
                  <SliderInput
                    label="Opacity"
                    disabled={!editable}
                    min={0}
                    max={1}
                    step={0.01}
                    value={values[opacityKey]}
                    setValue={handleChangeOpacity}
                  />
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          ) : (
            <></>
          )}

          {extraChildren}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});
