import React, { useCallback } from "react";
import { Form } from "formik";

import { Box, Checkbox, Grid } from "components/MaterialUI";
import { SubForm } from "./SubForm";

import { LightTooltip, SliderInput } from "components/common";
import { CustomFormControlLabel } from "./styles";

export const InnerForm = React.memo(
  ({
    editable,
    initialValues,
    paintingGuides,
    onCancel,
    onChangePaintingGuides,
    onApply,
    ...formProps
  }) => {
    const handleTogglePaintingGuide = useCallback(
      (guideItem) => {
        let index = paintingGuides.indexOf(guideItem);
        let newGuide = [...paintingGuides];
        if (index === -1) newGuide.push(guideItem);
        else newGuide.splice(index, 1);
        onChangePaintingGuides(newGuide);
      },
      [onChangePaintingGuides, paintingGuides]
    );

    const handleChangeGridPadding = useCallback(
      (value) => formProps.setFieldValue("grid_padding", value),
      [formProps]
    );

    const handleChangeGridStroke = useCallback(
      (value) => formProps.setFieldValue("grid_stroke", value),
      [formProps]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <Box height="100%" overflow="auto">
          <SubForm
            guideID="car-mask"
            label="Car Mask"
            colorKey="carmask_color"
            opacityKey="carmask_opacity"
            editable={editable}
            fields={["carmask_color", "carmask_opacity"]}
            initialValues={initialValues}
            paintingGuides={paintingGuides}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
          />
          <SubForm
            guideID="wireframe"
            label="Wireframe"
            colorKey="wireframe_color"
            opacityKey="wireframe_opacity"
            fields={["wireframe_color", "wireframe_opacity", "show_wireframe"]}
            editable={editable}
            initialValues={initialValues}
            paintingGuides={paintingGuides}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <Grid item xs={12} sm={12}>
                <LightTooltip
                  title="Automatically display the wireframe guide when actively moving, resizing, or rotating a layer"
                  arrow
                >
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
                    label="Show when editing"
                    labelPlacement="start"
                  />
                </LightTooltip>
              </Grid>
            }
          />
          <SubForm
            guideID="sponsor-blocks"
            label="Sponsor Blocks"
            colorKey="sponsor_color"
            opacityKey="sponsor_opacity"
            fields={[
              "sponsor_color",
              "sponsor_opacity",
              "show_sponsor",
              "show_sponsor_block_on_top",
            ]}
            editable={editable}
            initialValues={initialValues}
            paintingGuides={paintingGuides}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="Automatically display the sponsor blocks guide when actively moving, resizing, or rotating a layer"
                    arrow
                  >
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
                      label="Show when editing"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="If checked, when the sponsor blocks guide is visible, it will appear on top of all the layers"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="show_sponsor_block_on_top"
                          checked={formProps.values.show_sponsor_block_on_top}
                          disabled={!editable}
                          onChange={(event) =>
                            formProps.setFieldValue(
                              "show_sponsor_block_on_top",
                              event.target.checked
                            )
                          }
                        />
                      }
                      label={`Display above layers`}
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
              </>
            }
          />
          <SubForm
            guideID="number-blocks"
            label="Number Blocks"
            colorKey="numberblock_color"
            opacityKey="numberblock_opacity"
            fields={[
              "numberblock_color",
              "numberblock_opacity",
              "show_numberBlocks",
              "show_number_block_on_top",
            ]}
            editable={editable}
            initialValues={initialValues}
            paintingGuides={paintingGuides}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="Automatically display the number blocks guide when actively moving, resizing, or rotating a layer"
                    arrow
                  >
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
                      label="Show when editing"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="If checked, when the number blocks guide is visible, it will appear on top of all the layers"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="show_number_block_on_top"
                          checked={formProps.values.show_number_block_on_top}
                          disabled={!editable}
                          onChange={(event) =>
                            formProps.setFieldValue(
                              "show_number_block_on_top",
                              event.target.checked
                            )
                          }
                        />
                      }
                      label={`Display above layers`}
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
              </>
            }
          />
          <SubForm
            guideID="grid"
            label="Grid"
            colorKey="grid_color"
            opacityKey="grid_opacity"
            fields={[
              "grid_color",
              "grid_opacity",
              "grid_padding",
              "grid_stroke",
              "show_grid",
              "snap_grid",
            ]}
            editable={editable}
            initialValues={initialValues}
            paintingGuides={paintingGuides}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12} component={Box} height="40px">
                  <Box pr="9px">
                    <SliderInput
                      label="Column Size"
                      min={5}
                      max={50}
                      step={1}
                      value={formProps.values.grid_padding}
                      disabled={!editable}
                      setValue={handleChangeGridPadding}
                      small
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} component={Box} height="40px">
                  <Box pr="9px">
                    <SliderInput
                      label="Stroke Width"
                      min={0.01}
                      max={3}
                      step={0.01}
                      value={formProps.values.grid_stroke}
                      disabled={!editable}
                      setValue={handleChangeGridStroke}
                      small
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="Automatically display the grid guide when actively moving, resizing, or rotating a layer"
                    arrow
                  >
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
                      label="Show when editing"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        name="snap_grid"
                        checked={formProps.values.snap_grid}
                        disabled={!editable}
                        onChange={(event) =>
                          formProps.setFieldValue(
                            "snap_grid",
                            event.target.checked
                          )
                        }
                      />
                    }
                    label="Snap when editing"
                    labelPlacement="start"
                  />
                </Grid>
              </>
            }
          />
          <SubForm
            label="Car Parts"
            fields={["show_carparts_on_top"]}
            editable={editable}
            initialValues={initialValues}
            {...formProps}
            extraChildren={
              <Grid item xs={12} sm={12}>
                <LightTooltip
                  title="If checked, it will appear on top of all the layers"
                  arrow
                >
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
                    label="Display above layers"
                    labelPlacement="start"
                  />
                </LightTooltip>
              </Grid>
            }
          />
        </Box>
      </Form>
    );
  }
);
