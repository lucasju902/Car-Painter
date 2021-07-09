import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import styled from "styled-components/macro";
import { colorValidator } from "helper";

import { spacing } from "@material-ui/system";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography as MuiTypography,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import SliderInput from "components/SliderInput";
import ColorPickerInput from "components/ColorPickerInput";

const Button = styled(MuiButton)(spacing);
const Typography = styled(MuiTypography)(spacing);
const CustomAccordionSummary = styled(AccordionSummary)`
  background: #3f3f3f;
  border-radius: 5px;
`;
const CustomFormControlLabel = styled(FormControlLabel)`
  margin-left: 0;
  color: rgba(255, 255, 255, 0.5);
`;
const CustomDialogContent = styled(DialogContent)`
  padding-right: 0;
`;

const SubForm = (props) => {
  const {
    label,
    colorKey,
    opacityKey,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    extraChildren,
  } = props;
  const [expanded, setExpanded] = useState(true);
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label}</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%" mb={1}>
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
              <Grid item xs={12} sm={6}>
                <SliderInput
                  label="Opacity"
                  min={0}
                  max={1}
                  step={0.01}
                  value={values[opacityKey]}
                  setValue={(value) => setFieldValue(opacityKey, value)}
                />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          {extraChildren}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const SchemeSettingsDialog = (props) => {
  const { onCancel, open, onApply } = props;
  const guide_data = useSelector(
    (state) => state.schemeReducer.current.guide_data
  );

  return (
    <Dialog
      aria-labelledby="insert-text-title"
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="insert-text-title">Settings</DialogTitle>
      <Formik
        initialValues={{
          carmask_color: guide_data.carmask_color || "",
          carmask_opacity: guide_data.carmask_opacity || 1,
          wireframe_color: guide_data.wireframe_color || "",
          wireframe_opacity: guide_data.wireframe_opacity || 1,
          sponsor_color: guide_data.sponsor_color || "",
          sponsor_opacity: guide_data.sponsor_opacity || 1,
          numberblock_color: guide_data.numberblock_color || "",
          numberblock_opacity: guide_data.numberblock_opacity || 1,
          grid_color: guide_data.grid_color || "",
          grid_opacity: guide_data.grid_opacity || 1,
          grid_padding: guide_data.grid_padding || 10,
          grid_stroke: guide_data.grid_stroke || 0.1,
          show_wireframe: guide_data.show_wireframe || false,
          show_sponsor: guide_data.show_sponsor || false,
          show_numberBlocks: guide_data.show_numberBlocks || false,
          show_grid: guide_data.show_grid || false,
          show_carparts_on_top: guide_data.show_carparts_on_top || false,
        }}
        validationSchema={Yup.object().shape({
          carmask_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          wireframe_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          sponsor_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          numberblock_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          grid_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
        })}
        validate={(values) => {
          console.log(values);
          return {};
        }}
        onSubmit={onApply}
      >
        {(formProps) => (
          <Form onSubmit={formProps.handleSubmit} noValidate>
            <CustomDialogContent dividers id="insert-text-dialog-content">
              <Box maxHeight="70vh" pr={5} overflow="auto">
                <SubForm
                  label="Car Mask"
                  colorKey="carmask_color"
                  opacityKey="carmask_opacity"
                  {...formProps}
                />
                <SubForm
                  label="Wireframe"
                  colorKey="wireframe_color"
                  opacityKey="wireframe_opacity"
                  {...formProps}
                  extraChildren={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <CustomFormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              name="show_wireframe"
                              checked={formProps.values.show_wireframe}
                              onChange={(event) =>
                                formProps.setFieldValue(
                                  "show_wireframe",
                                  event.target.checked
                                )
                              }
                            />
                          }
                          label="Show Wireframe for Repositioning"
                          labelPlacement="start"
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <SubForm
                  label="Sponsor Blocks"
                  colorKey="sponsor_color"
                  opacityKey="sponsor_opacity"
                  {...formProps}
                  extraChildren={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <CustomFormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              name="show_sponsor"
                              checked={formProps.values.show_sponsor}
                              onChange={(event) =>
                                formProps.setFieldValue(
                                  "show_sponsor",
                                  event.target.checked
                                )
                              }
                            />
                          }
                          label="Show Sponsor Blocks for Repositioning"
                          labelPlacement="start"
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <SubForm
                  label="Number Blocks"
                  colorKey="numberblock_color"
                  opacityKey="numberblock_opacity"
                  {...formProps}
                  extraChildren={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <CustomFormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              name="show_numberBlocks"
                              checked={formProps.values.show_numberBlocks}
                              onChange={(event) =>
                                formProps.setFieldValue(
                                  "show_numberBlocks",
                                  event.target.checked
                                )
                              }
                            />
                          }
                          label="Show Number Blocks for Repositioning"
                          labelPlacement="start"
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <SubForm
                  label="Grid"
                  colorKey="grid_color"
                  opacityKey="grid_opacity"
                  {...formProps}
                  extraChildren={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <SliderInput
                          label="Column Size"
                          min={5}
                          max={50}
                          step={1}
                          value={formProps.values.grid_padding}
                          setValue={(value) =>
                            formProps.setFieldValue("grid_padding", value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <SliderInput
                          label="Stroke Width"
                          min={0.01}
                          max={3}
                          step={0.01}
                          value={formProps.values.grid_stroke}
                          setValue={(value) =>
                            formProps.setFieldValue("grid_stroke", value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <CustomFormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              name="show_grid"
                              checked={formProps.values.show_grid}
                              onChange={(event) =>
                                formProps.setFieldValue(
                                  "show_grid",
                                  event.target.checked
                                )
                              }
                            />
                          }
                          label="Show Grid for Repositioning"
                          labelPlacement="start"
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <SubForm
                  label="Car Parts"
                  {...formProps}
                  extraChildren={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <CustomFormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              name="show_carparts_on_top"
                              checked={formProps.values.show_carparts_on_top}
                              onChange={(event) =>
                                formProps.setFieldValue(
                                  "show_carparts_on_top",
                                  event.target.checked
                                )
                              }
                            />
                          }
                          label="Show Car Parts on top of other layers"
                          labelPlacement="start"
                        />
                      </Grid>
                    </Grid>
                  }
                />
              </Box>
            </CustomDialogContent>
            <DialogActions>
              <Button onClick={onCancel} color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="outlined"
                disabled={formProps.isSubmitting || !formProps.isValid}
              >
                Apply
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default React.memo(SchemeSettingsDialog);
