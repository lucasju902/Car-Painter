import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";

import { colorValidator } from "helper";

import { InnerForm } from "./InnerForm";

export const GuidesSetting = React.memo((props) => {
  const { guide_data, editable, onCancel, onApply } = props;

  const initialValues = useMemo(
    () => ({
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
      snap_grid: guide_data.snap_grid || false,
      show_carparts_on_top: guide_data.show_carparts_on_top || false,
      show_sponsor_block_on_top: guide_data.show_sponsor_block_on_top || false,
      show_number_block_on_top: guide_data.show_number_block_on_top || false,
    }),
    [guide_data]
  );

  return (
    <Formik
      initialValues={initialValues}
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
        return {};
      }}
      onSubmit={onApply}
    >
      {(formProps) => (
        <InnerForm {...formProps} editable={editable} onCancel={onCancel} />
      )}
    </Formik>
  );
});
