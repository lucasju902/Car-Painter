import React, { useState, useMemo, useCallback } from "react";

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
import { LabelTypography } from "pages/scheme/components/PropertyBar/PropertyBar.style";
import { focusBoardQuickly } from "helper";

export const SubForm = React.memo((props) => {
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

  const handleChangeOpacity = useCallback(
    (value) => setFieldValue(opacityKey, value),
    [opacityKey, setFieldValue]
  );

  const handleChangeColor = useCallback(
    (color) => setFieldValue(colorKey, color),
    [colorKey, setFieldValue]
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
        <Box display="flex" flexDirection="column" width="100%" my={1}>
          <Grid container spacing={2}>
            {guideID ? (
              <Grid
                item
                xs={12}
                sm={12}
                component={Box}
                height="40px"
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <LabelTypography variant="body1" color="textSecondary" mr={2}>
                  Visibility
                </LabelTypography>
                <IconButton
                  disabled={!editable}
                  onClick={() => onToggleGuideVisible(guideID)}
                  size="small"
                  style={{ padding: "9px" }}
                >
                  {guideVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Grid>
            ) : (
              <></>
            )}
            {colorKey || opacityKey ? (
              <>
                {colorKey ? (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    component={Box}
                    height="40px"
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <LabelTypography
                      variant="body1"
                      color="textSecondary"
                      mr={2}
                    >
                      Color
                    </LabelTypography>
                    <Box pr="9px">
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
                  <Grid item xs={12} sm={12} component={Box} height="40px">
                    <Box pr="9px">
                      <SliderInput
                        label="Opacity"
                        disabled={!editable}
                        min={0.0}
                        max={1.0}
                        step={0.1}
                        marks
                        value={values[opacityKey]}
                        setValue={handleChangeOpacity}
                        small
                      />
                    </Box>
                  </Grid>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {extraChildren}
          </Grid>
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
});
