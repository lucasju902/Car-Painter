import React from "react";
import { Form } from "formik";

import {
  Box,
  Button,
  DialogActions,
  Checkbox,
  Grid,
} from "components/MaterialUI";
import { SubForm } from "./sub-form";

import SliderInput from "components/SliderInput";
import { CustomFormControlLabel, CustomDialogContent } from "./styles";

export const InnerForm = React.memo(({ editable, onCancel, ...formProps }) => {
  return (
    <Form onSubmit={formProps.handleSubmit} noValidate>
      <CustomDialogContent dividers id="insert-text-dialog-content">
        <Box maxHeight="70vh" pr={5} overflow="auto">
          <SubForm
            label="Car Mask"
            colorKey="carmask_color"
            opacityKey="carmask_opacity"
            editable={editable}
            {...formProps}
          />
          <SubForm
            label="Wireframe"
            colorKey="wireframe_color"
            opacityKey="wireframe_opacity"
            editable={editable}
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
                        disabled={!editable}
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
            editable={editable}
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
                        disabled={!editable}
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
            editable={editable}
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
                        disabled={!editable}
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
            editable={editable}
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
                    disabled={!editable}
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
                    disabled={!editable}
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
                        disabled={!editable}
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
            editable={editable}
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
                        disabled={!editable}
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
          disabled={formProps.isSubmitting || !formProps.isValid || !editable}
        >
          Apply
        </Button>
      </DialogActions>
    </Form>
  );
});
