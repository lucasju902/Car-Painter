import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import { Box, Typography, Button } from "@material-ui/core";
import GeneralProperty from "./GeneralProperty";
import SizeProperty from "./SizeProperty";
import PositionProperty from "./PositionProperty";
import FontProperty from "./FontProperty";
import StrokeProperty from "./StrokeProperty";

import { updateLayer } from "redux/reducers/layerReducer";
import RotationProperty from "./RotationProperty";
import { AllowedLayerProps } from "constant";

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

  const handleApply = (values) => {
    dispatch(updateLayer(values));
  };

  const checkDirty = (values) => {
    for (let i in values.layer_data) {
      if (values.layer_data[i] !== currentLayer.layer_data[i]) {
        return true;
      }
    }
    for (let i in values) {
      if (i != "layer_data" && values[i] !== currentLayer[i]) {
        return true;
      }
    }
    return false;
  };

  if (currentLayer) {
    const defaultValues = _.pick(
      {
        layer_visible: 1,
        layer_locked: 0,
        layer_data: _.pick(
          {
            name: "",
            text: "",
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            rotation: 0,
            flop: 0,
            flip: 0,
            scaleX: 1,
            scaleY: 1,
            stroke: 0,
            font: 0,
            size: 0,
            scolor: "#ffffff",
            color: "#ffffff",
          },
          AllowedLayerProps[currentLayer.layer_type]
            .filter((item) => item.includes("layer_data."))
            .map((item) => item.replace("layer_data.", ""))
        ),
      },
      AllowedLayerProps[currentLayer.layer_type].filter(
        (item) => !item.includes("layer_data.")
      )
    );
    console.log("defaultValues: ", defaultValues);
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
            layer_visible: Yup.number(),
            layer_locked: Yup.number(),
            layer_data: Yup.object({
              name: Yup.string().required("Required"),
              width: Yup.number()
                .required("Required")
                .moreThan(0, "Must be greater than 0"),
              height: Yup.number()
                .required("Required")
                .moreThan(0, "Must be greater than 0"),
              left: Yup.number().required("Required"),
              top: Yup.number().required("Required"),
              rotation: Yup.number()
                .required("Required")
                .moreThan(-180, "Must be greater than -180")
                .lessThan(180, "Must be less than 180"),
              flop: Yup.number(),
              flip: Yup.number(),
              scaleX: Yup.number().moreThan(0, "Must be greater than 0"),
              scaleY: Yup.number().moreThan(0, "Must be greater than 0"),
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
            <Form onSubmit={formProps.handleSubmit}>
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
              <GeneralProperty {...formProps} />
              <FontProperty {...formProps} fontList={fontList} />
              <StrokeProperty {...formProps} />
              <SizeProperty {...formProps} />
              <PositionProperty {...formProps} />
              <RotationProperty {...formProps} />
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  }
  return <></>;
};

export default PropertyBar;
