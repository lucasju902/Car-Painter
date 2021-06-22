import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import styled from "styled-components/macro";
import { colorValidator } from "helper";

import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography as MuiTypography,
  Grid,
} from "@material-ui/core";
import SliderInput from "components/SliderInput";
import ColorPickerInput from "components/ColorPickerInput";

const Button = styled(MuiButton)(spacing);
const Typography = styled(MuiTypography)(spacing);

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
  return (
    <Box display="flex" flexDirection="column" width="100%" mb={1}>
      <Grid container spacing={2}>
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
      </Grid>
      {extraChildren}
    </Box>
  );
};

const DefaultSettingsDialog = (props) => {
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
      <DialogTitle id="insert-text-title">Default Shape Settings</DialogTitle>
      <Formik
        initialValues={{
          default_shape_color: guide_data.default_shape_color || "#000000",
          default_shape_opacity: guide_data.default_shape_opacity || 1,
          default_shape_scolor: guide_data.default_shape_scolor || "#000000",
          default_shape_stroke: guide_data.default_shape_stroke || 1,
        }}
        validationSchema={Yup.object().shape({
          default_shape_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          default_shape_scolor: Yup.string()
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
            <DialogContent dividers id="insert-text-dialog-content">
              <SubForm
                label="Default Shapes"
                colorKey="default_shape_color"
                opacityKey="default_shape_opacity"
                {...formProps}
                extraChildren={
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          mr={2}
                        >
                          Stroke Color
                        </Typography>
                        <ColorPickerInput
                          value={formProps.values["default_shape_scolor"]}
                          onChange={(color) =>
                            formProps.setFieldValue(
                              "default_shape_scolor",
                              color
                            )
                          }
                          onInputChange={(color) =>
                            formProps.setFieldValue(
                              "default_shape_scolor",
                              color
                            )
                          }
                          error={Boolean(
                            formProps.errors["default_shape_scolor"]
                          )}
                          helperText={formProps.errors["default_shape_scolor"]}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SliderInput
                        label="Stroke Width"
                        min={0}
                        max={1}
                        step={0.01}
                        value={formProps.values["default_shape_stroke"]}
                        setValue={(value) =>
                          formProps.setFieldValue("default_shape_stroke", value)
                        }
                      />
                    </Grid>
                  </Grid>
                }
              />
            </DialogContent>
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

export default React.memo(DefaultSettingsDialog);
