import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import { updateLayer } from "redux/reducers/layerReducer";
import { AllowedLayerProps, LayerTypes, DefaultLayer } from "constant";
import { colorValidator } from "helper";

import { Box, Typography, Button } from "@material-ui/core";
import GeneralProperty from "./GeneralProperty";
import SizeProperty from "./SizeProperty";
import PositionProperty from "./PositionProperty";
import FontProperty from "./FontProperty";
import StrokeProperty from "./StrokeProperty";
import ColorProperty from "./ColorProperty";
import RotationProperty from "./RotationProperty";
import ShadowProperty from "./ShadowProperty";
import CornerProperty from "./CornerProperty";

const Wrapper = styled(Box)`
  width: 350px;
  position: fixed;
  right: 0;
  top: 0;
  background: #666666;
  height: calc(100% - 50px);
  overflow: auto;
`;

const PropertyBar = () => {
  const dispatch = useDispatch();
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const fontList = useSelector((state) => state.fontReducer.list);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
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

  const handleApply = (values) => {
    dispatch(updateLayer(values));
  };
  const toggleField = (field) => {
    dispatch(
      updateLayer({
        ...currentLayer,
        [field]: currentLayer[field] ? 0 : 1,
      })
    );
  };
  const toggleLayerDataField = (field) => {
    dispatch(
      updateLayer({
        ...currentLayer,
        layer_data: {
          ...currentLayer.layer_data,
          [field]: currentLayer.layer_data[field] ? 0 : 1,
        },
      })
    );
  };

  const checkDirty = (values) => {
    for (let i in values.layer_data) {
      if (values.layer_data[i] != currentLayer.layer_data[i]) {
        return true;
      }
    }
    for (let i in values) {
      if (i != "layer_data" && values[i] != currentLayer[i]) {
        return true;
      }
    }
    return false;
  };

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
            layer_data: Yup.object({
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
              cornerTopLeft: Yup.number(),
              cornerTopRight: Yup.number(),
              cornerBottomLeft: Yup.number(),
              cornerBottomRight: Yup.number(),
              radius: Yup.number().moreThan(0, "Must be greater than 0"),
              innerRadius: Yup.number().moreThan(0, "Must be greater than 0"),
              outerRadius: Yup.number().moreThan(0, "Must be greater than 0"),
              numPoints: Yup.number().moreThan(1, "Must be greater than 1"),
              angle: Yup.number(),
            }),
          })}
          enableReinitialize
          validate={(values) => {
            console.log(values);
            return {};
          }}
          onSubmit={handleApply}
        >
          {(formProps) => (
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
                {formProps.isValid && checkDirty(formProps.values) ? (
                  <Button type="submit" color="primary" variant="outlined">
                    Apply
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
              <GeneralProperty {...formProps} toggleField={toggleField} />
              <FontProperty {...formProps} fontList={fontList} />
              <ColorProperty {...formProps} />
              <StrokeProperty {...formProps} />
              <SizeProperty
                {...formProps}
                toggleLayerDataField={toggleLayerDataField}
                currentLayer={currentLayer}
                pressedKey={pressedKey}
              />
              <PositionProperty {...formProps} />
              <RotationProperty {...formProps} />
              <ShadowProperty {...formProps} />
              <CornerProperty {...formProps} />
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  }
  return <></>;
};

export default PropertyBar;
