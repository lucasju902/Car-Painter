import React, { useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import { updateLayer } from "redux/reducers/layerReducer";
import { AllowedLayerProps, LayerTypes, DefaultLayer } from "constant";
import { colorValidator } from "helper";

import { Box, Typography } from "@material-ui/core";
import GeneralProperty from "./GeneralProperty";
import SizeProperty from "./SizeProperty";
import PositionProperty from "./PositionProperty";
import FontProperty from "./FontProperty";
import StrokeProperty from "./StrokeProperty";
import ColorProperty from "./ColorProperty";
import BackgroundProperty from "./BackgroundProperty";
import RotationProperty from "./RotationProperty";
import ShadowProperty from "./ShadowProperty";
import CornerProperty from "./CornerProperty";
import ExtraProperty from "./ExtraProperty";
import SkewProperty from "./SkewProperty";

const Wrapper = styled(Box)`
  width: 350px;
  position: fixed;
  right: 0;
  top: 0;
  background: #666666;
  height: calc(100% - 50px);
  overflow: auto;
`;

const InnerForm = React.memo(
  ({
    user,
    fontList,
    toggleField,
    toggleLayerDataField,
    currentLayer,
    pressedKey,
    onClone,
    onLayerDataUpdate,
    ...formProps
  }) => {
    const checkLayerDataDirty = useCallback(
      (params) => {
        for (let param of params) {
          if (
            formProps.values.layer_data[param] != currentLayer.layer_data[param]
          )
            return true;
        }
        return false;
      },
      [formProps.values, currentLayer]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          height="34px"
        >
          <Typography variant="h5" noWrap>
            Properties
          </Typography>
        </Box>
        <GeneralProperty
          {...formProps}
          user={user}
          toggleField={toggleField}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <FontProperty
          {...formProps}
          fontList={fontList}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ColorProperty
          {...formProps}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <BackgroundProperty
          {...formProps}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <StrokeProperty
          {...formProps}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onLayerDataUpdate={onLayerDataUpdate}
        />
        <SizeProperty
          {...formProps}
          toggleLayerDataField={toggleLayerDataField}
          currentLayer={currentLayer}
          pressedKey={pressedKey}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <PositionProperty
          {...formProps}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <RotationProperty
          {...formProps}
          toggleField={toggleField}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
        />
        <SkewProperty
          {...formProps}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ShadowProperty
          {...formProps}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
        />
        <CornerProperty
          {...formProps}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ExtraProperty {...formProps} onClone={onClone} />
      </Form>
    );
  }
);

const PropertyBar = (props) => {
  const { onClone } = props;
  const dispatch = useDispatch();
  const currentLayer = useSelector((state) => state.layerReducer.current);
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
  const handleClone = useCallback(() => {
    if (currentLayer) onClone(currentLayer);
  }, [onClone, currentLayer]);
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
          ...currentLayer,
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
          ...currentLayer,
          layer_data: {
            ...currentLayer.layer_data,
            [key]: value,
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
          ...currentLayer,
          layer_data: {
            ...currentLayer.layer_data,
            [field]: currentLayer.layer_data[field] ? 0 : 1,
          },
        })
      );
    },
    [dispatch, currentLayer]
  );

  if (currentLayer) {
    return (
      <Wrapper py={5} px={3}>
        <Formik
          initialValues={{
            ...defaultValues,
            ...currentLayer,
            layer_data: {
              ...defaultValues.layer_data,
              ...currentLayer.layer_data,
            },
          }}
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
                  innerRadius: Yup.number().moreThan(
                    0,
                    "Must be greater than 0"
                  ),
                  outerRadius: Yup.number().moreThan(
                    0,
                    "Must be greater than 0"
                  ),
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
          validate={(values) => {
            console.log(values);
            return {};
          }}
          onSubmit={handleApply}
        >
          {(formProps) => (
            <InnerForm
              {...formProps}
              user={user}
              fontList={fontList}
              toggleField={toggleField}
              toggleLayerDataField={toggleLayerDataField}
              currentLayer={currentLayer}
              pressedKey={pressedKey}
              onClone={handleClone}
              onLayerDataUpdate={handleLayerDataUpdate}
            />
          )}
        </Formik>
      </Wrapper>
    );
  }
  return <></>;
};

export default PropertyBar;
