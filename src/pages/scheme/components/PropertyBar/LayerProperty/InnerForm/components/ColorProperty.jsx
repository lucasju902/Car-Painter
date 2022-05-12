import React, { useState, useMemo, useCallback } from "react";

import { AllowedLayerProps, LayerTypes, FinishOptions } from "constant";

import {
  Box,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { ColorPickerInput } from "components/common";
import { useSelector } from "react-redux";
import { LabelTypography } from "../../../PropertyBar.style";
import { focusBoardQuickly } from "helper";

export const ColorProperty = React.memo((props) => {
  const {
    editable,
    currentCarMake,
    errors,
    isValid,
    checkLayerDataDirty,
    setFieldValue,
    values,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["color", "blendType", "finish"];
  const [expanded, setExpanded] = useState(true);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const logoList = useSelector((state) => state.logoReducer.list);
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );
  const foundLogo = useMemo(
    () =>
      values.layer_type === LayerTypes.LOGO
        ? logoList.find(
            (item) => item.source_file === values.layer_data.source_file
          )
        : null,
    [logoList, values.layer_data.source_file, values.layer_type]
  );
  const showColor = useMemo(
    () =>
      AllowedLayerTypes.includes("layer_data.color") &&
      values.layer_type !== LayerTypes.TEXT &&
      (values.layer_type !== LayerTypes.LOGO ||
        (foundLogo && foundLogo.enable_color)),
    [AllowedLayerTypes, foundLogo, values.layer_type]
  );
  const showBlendType = useMemo(
    () => AllowedLayerTypes.includes("layer_data.blendType"),
    [AllowedLayerTypes]
  );
  const showFinish = useMemo(
    () =>
      !currentScheme.hide_spec &&
      AllowedLayerTypes.includes("layer_data.finish") &&
      currentCarMake.car_type !== "Misc",
    [AllowedLayerTypes, currentScheme.hide_spec, currentCarMake.car_type]
  );

  const handleColorInstantChange = useCallback(
    (color) => onLayerDataUpdate("color", color),
    [onLayerDataUpdate]
  );

  const handleColorChange = useCallback(
    (color) => setFieldValue("layer_data.color", color),
    [setFieldValue]
  );

  if (!showColor && !showBlendType && !showFinish) return <></>;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        focusBoardQuickly();
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Colors</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {showColor ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box height="100%" display="flex" alignItems="center">
                    <LabelTypography color="textSecondary" mr={2}>
                      Color
                    </LabelTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <ColorPickerInput
                    value={values.layer_data.color}
                    disabled={!editable}
                    onChange={handleColorInstantChange}
                    onInputChange={handleColorChange}
                    error={Boolean(
                      errors.layer_data && errors.layer_data.color
                    )}
                    helperText={errors.layer_data && errors.layer_data.color}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {showBlendType ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid container spacing={2} component={Box}>
                <Grid item xs={6}>
                  <Box height="100%" display="flex" alignItems="center">
                    <LabelTypography
                      variant="body1"
                      color="textSecondary"
                      mr={2}
                    >
                      Blend Type
                    </LabelTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Select
                    name="layer_data.blendType"
                    variant="outlined"
                    value={values.layer_data.blendType}
                    disabled={!editable}
                    onChange={(event) =>
                      onLayerDataUpdate("blendType", event.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="normal">Normal</MenuItem>

                    <MenuItem value="multiply">Multiply</MenuItem>
                    <MenuItem value="darken">Darken</MenuItem>
                    <MenuItem value="lighten">Lighten</MenuItem>
                    <MenuItem value="color-burn">Color Burn</MenuItem>
                    <MenuItem value="color">Color</MenuItem>
                    <MenuItem value="screen">Screen</MenuItem>
                    <MenuItem value="overlay">Overlay</MenuItem>
                    <MenuItem value="hue">Hue</MenuItem>
                    <MenuItem value="saturation">Saturation</MenuItem>
                    <MenuItem value="luminosity">Luminosity</MenuItem>
                    <MenuItem value="xor">Xor</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
          {showFinish ? (
            <Box display="flex" alignItems="center" height="40px">
              <Grid container spacing={2} component={Box}>
                <Grid item xs={6}>
                  <Box height="100%" display="flex" alignItems="center">
                    <LabelTypography
                      variant="body1"
                      color="textSecondary"
                      mr={2}
                    >
                      Finish
                    </LabelTypography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Select
                    name="layer_data.finish"
                    variant="outlined"
                    value={values.layer_data.finish}
                    disabled={!editable}
                    onChange={(event) =>
                      onLayerDataUpdate("finish", event.target.value)
                    }
                    fullWidth
                  >
                    {FinishOptions.map((finishItem, index) => (
                      <MenuItem value={finishItem.value} key={index}>
                        {finishItem.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
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
});
