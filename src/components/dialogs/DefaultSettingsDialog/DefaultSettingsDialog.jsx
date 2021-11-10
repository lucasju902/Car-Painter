import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import { colorValidator } from "helper";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from "components/MaterialUI";
import { ColorPickerInput, SliderInput } from "components/common";
import { SubForm } from "./SubForm";

export const DefaultSettingsDialog = React.memo((props) => {
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
          default_shape_stroke:
            guide_data.default_shape_stroke != null
              ? guide_data.default_shape_stroke
              : 1,
        }}
        validationSchema={Yup.object().shape({
          default_shape_color: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
          default_shape_scolor: Yup.string()
            .nullable()
            .test("color-validation", "Incorrect Color Format", colorValidator),
        })}
        enableReinitialize
        validate={(values) => {
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
                        max={10}
                        step={1}
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
});

export default DefaultSettingsDialog;
