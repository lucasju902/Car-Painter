import React, { useState, useMemo } from "react";

import {
  Accordion,
  AccordionDetails,
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
} from "components/MaterialUI";
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { ColorPickerInput, SliderInput } from "components/common";
import { CustomAccordionSummary } from "./styles";

export const SubForm = (props) => {
  const {
    label,
    editable,
    colorKey,
    opacityKey,
    errors,
    isValid,
    setFieldValue,
    values,
    extraChildren,
    fields,
    initialValues,
    guideID,
    paintingGuides,
    onToggleGuideVisible,
  } = props;
  const [expanded, setExpanded] = useState(true);
  const isCustomDirty = useMemo(
    () => fields.some((item) => values[item] !== initialValues[item]),
    [values, fields, initialValues]
  );
  const guideVisible = useMemo(
    () =>
      paintingGuides && guideID
        ? paintingGuides.indexOf(guideID) !== -1
        : false,
    [guideID, paintingGuides]
  );

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label}</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%" my={1}>
          {guideID ? (
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
                disabled={!editable}
                onClick={() => onToggleGuideVisible(guideID)}
                size="small"
              >
                {guideVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Box>
          ) : (
            <></>
          )}
          {colorKey || opacityKey ? (
            <Grid container>
              {colorKey ? (
                <Grid item xs={12} sm={12}>
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
                      onChange={(color) => setFieldValue(colorKey, color)}
                      onInputChange={(color) => setFieldValue(colorKey, color)}
                      error={Boolean(errors[colorKey])}
                      helperText={errors[colorKey]}
                    />
                  </Box>
                </Grid>
              ) : (
                <></>
              )}
              {opacityKey ? (
                <Grid item xs={12} sm={12}>
                  <SliderInput
                    label="Opacity"
                    disabled={!editable}
                    min={0.0}
                    max={1.0}
                    step={0.1}
                    marks
                    value={values[opacityKey]}
                    setValue={(value) => setFieldValue(opacityKey, value)}
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
          {isCustomDirty ? (
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              fullWidth
              disabled={!isValid}
            >
              Apply
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
