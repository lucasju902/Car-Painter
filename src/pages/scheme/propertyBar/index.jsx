import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Box, Typography, Button } from "@material-ui/core";
import GeneralProperty from "./GeneralProperty";
import SizeProperty from "./SizeProperty";
import PositionProperty from "./PositionProperty";

import { updateLayer } from "redux/reducers/layerReducer";
import RotationProperty from "./RotationProperty";
import { object } from "prop-types";

const Wrapper = styled(Box)`
  width: 350px;
  position: fixed;
  right: 0;
  top: 0;
  background: #666666;
  height: 100%;
  overflow: auto;
`;

const PropertyBar = () => {
  const dispatch = useDispatch();
  const currentLayer = useSelector((state) => state.layerReducer.current);

  const handleApply = (values) => {
    dispatch(updateLayer(values));
  };

  const checkDirty = (values) => {
    for (let i in currentLayer.layer_data) {
      if (values.layer_data[i] !== currentLayer.layer_data[i]) {
        return true;
      }
    }
    return false;
  };

  if (currentLayer) {
    const defaultValues = {
      layer_data: {
        name: "",
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        rotation: 0,
        flop: 0,
        flip: 0,
      },
    };
    return (
      <Wrapper py={5} px={3}>
        <Formik
          initialValues={Object.assign(defaultValues, { ...currentLayer })}
          validationSchema={Yup.object({
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
