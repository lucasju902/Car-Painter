import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";

import SizeProperty from "./SizeProperty";

import { Box, Typography } from "@material-ui/core";
import { updateLayer } from "redux/reducers/layerReducer";

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

  const handleLayerDataChange = (values) => {
    dispatch(
      updateLayer({
        ...currentLayer,
        layer_data: {
          ...currentLayer.layer_data,
          ...values,
        },
      })
    );
  };

  if (currentLayer) {
    return (
      <Wrapper py={5} px={3}>
        <Typography variant="h5" noWrap>
          Properties for {currentLayer.layer_data.name}
        </Typography>
        <SizeProperty
          currentLayer={currentLayer}
          onChange={handleLayerDataChange}
        />
      </Wrapper>
    );
  }
  return <></>;
};

export default PropertyBar;
