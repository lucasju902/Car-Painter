import React, { useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import { updateLayer } from "redux/reducers/layerReducer";
import { AllowedLayerProps, LayerTypes, DefaultLayer } from "constant";
import { colorValidator } from "helper";

import { InnerForm } from "./InnerForm";

export const LayerProperty = React.memo((props) => {
  const { editable, stageRef, onClone, onDelete } = props;
  const dispatch = useDispatch();

  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const fontList = useSelector((state) => state.fontReducer.list);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const user = useSelector((state) => state.authReducer.user);
  const AllowedLayerTypes = useMemo(
    () =>
      !currentLayer
        ? []
        : currentLayer.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[currentLayer.layer_type]
        : AllowedLayerProps[currentLayer.layer_type][
            currentLayer.layer_data.type
          ],
    [currentLayer]
  );
  const defaultValues = useMemo(
    () =>
      _.pick(
        {
          layer_visible: 1,
          layer_locked: 0,
          layer_data: _.pick(
            DefaultLayer.layer_data,
            AllowedLayerTypes.filter((item) =>
              item.includes("layer_data.")
            ).map((item) => item.replace("layer_data.", ""))
          ),
        },
        AllowedLayerTypes.filter((item) => !item.includes("layer_data."))
      ),
    [AllowedLayerTypes]
  );
  const initialValues = useMemo(
    () =>
      currentLayer
        ? {
            ...defaultValues,
            ...currentLayer,
            layer_data: {
              ...defaultValues.layer_data,
              ...currentLayer.layer_data,
            },
          }
        : { ...defaultValues },
    [defaultValues, currentLayer]
  );
  const handleClone = useCallback(() => {
    if (currentLayer) onClone(currentLayer);
  }, [onClone, currentLayer]);
  const handleDelete = useCallback(() => {
    if (currentLayer) onDelete(currentLayer);
  }, [onDelete, currentLayer]);
  const handleApply = useCallback(
    (values) => {
      dispatch(updateLayer(values));
    },
    [dispatch]
  );
  const toggleField = useCallback(
    (field) => {
      dispatch(
        updateLayer({
          id: currentLayer.id,
          [field]: currentLayer[field] ? 0 : 1,
        })
      );
    },
    [dispatch, currentLayer]
  );
  const handleLayerDataUpdate = useCallback(
    (key, value) => {
      dispatch(
        updateLayer({
          id: currentLayer.id,
          layer_data: {
            ...currentLayer.layer_data,
            [key]: value,
          },
        })
      );
    },
    [dispatch, currentLayer]
  );
  const handleLayerDataMultiUpdate = useCallback(
    (updatedValues) => {
      dispatch(
        updateLayer({
          id: currentLayer.id,
          layer_data: {
            ...currentLayer.layer_data,
            ...updatedValues,
          },
        })
      );
    },
    [dispatch, currentLayer]
  );
  const toggleLayerDataField = useCallback(
    (field) => {
      dispatch(
        updateLayer({
          id: currentLayer.id,
          layer_data: {
            ...currentLayer.layer_data,
            [field]: currentLayer.layer_data[field] ? 0 : 1,
          },
        })
      );
    },
    [dispatch, currentLayer]
  );

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          layer_order: Yup.number(),
          layer_visible: Yup.number(),
          layer_locked: Yup.number(),
          layer_data: Yup.object(
            _.pick(
              {
                name: Yup.string().required("Required"),
                text: Yup.string().test(
                  "text-validation",
                  "Required",
                  (value) =>
                    (value && value.length) ||
                    !AllowedLayerTypes.includes("layer_data.text")
                ),
                width: Yup.number().test(
                  "width-validation",
                  "Required",
                  (value) =>
                    value || !AllowedLayerTypes.includes("layer_data.width")
                ),
                height: Yup.number().test(
                  "height-validation",
                  "Required",
                  (value) =>
                    value || !AllowedLayerTypes.includes("layer_data.height")
                ),
                left: Yup.number(),
                top: Yup.number(),
                rotation: Yup.number()
                  .moreThan(-181, "Must be greater than -181")
                  .lessThan(181, "Must be less than 181"),
                flop: Yup.number(),
                flip: Yup.number(),
                scaleX: Yup.number().moreThan(0, "Must be greater than 0"),
                scaleY: Yup.number().moreThan(0, "Must be greater than 0"),
                color: Yup.string()
                  .nullable()
                  .test(
                    "color-validation",
                    "Incorrect Color Format",
                    colorValidator
                  ),
                size: Yup.number(),
                scolor: Yup.string()
                  .nullable()
                  .test(
                    "color-validation",
                    "Incorrect Color Format",
                    colorValidator
                  ),
                stroke: Yup.number(),
                font: Yup.number(),
                opacity: Yup.number(),
                shadowColor: Yup.string()
                  .nullable()
                  .test(
                    "color-validation",
                    "Incorrect Color Format",
                    colorValidator
                  ),
                shadowBlur: Yup.number(),
                shadowOpacity: Yup.number(),
                shadowOffsetX: Yup.number(),
                shadowOffsetY: Yup.number(),
                skewX: Yup.number(),
                skewY: Yup.number(),
                cornerTopLeft: Yup.number(),
                cornerTopRight: Yup.number(),
                cornerBottomLeft: Yup.number(),
                cornerBottomRight: Yup.number(),
                radius: Yup.number().moreThan(0, "Must be greater than 0"),
                innerRadius: Yup.number().moreThan(0, "Must be greater than 0"),
                outerRadius: Yup.number().moreThan(0, "Must be greater than 0"),
                numPoints: Yup.number().moreThan(1, "Must be greater than 1"),
                angle: Yup.number(),
                pointerLength: Yup.number().moreThan(
                  0,
                  "Must be greater than 0"
                ),
                pointerWidth: Yup.number().moreThan(
                  0,
                  "Must be greater than 0"
                ),
              },
              AllowedLayerTypes.filter((item) =>
                item.includes("layer_data.")
              ).map((item) => item.replace("layer_data.", ""))
            )
          ),
        })}
        enableReinitialize
        onSubmit={handleApply}
      >
        {(formProps) => (
          <InnerForm
            {...formProps}
            editable={editable}
            user={user}
            stageRef={stageRef}
            fontList={fontList}
            toggleField={toggleField}
            toggleLayerDataField={toggleLayerDataField}
            currentLayer={currentLayer}
            currentCarMake={currentCarMake}
            pressedKey={pressedKey}
            onClone={handleClone}
            onDelete={handleDelete}
            onLayerDataUpdate={handleLayerDataUpdate}
            onLayerDataMultiUpdate={handleLayerDataMultiUpdate}
          />
        )}
      </Formik>
    </>
  );
});

export default LayerProperty;
