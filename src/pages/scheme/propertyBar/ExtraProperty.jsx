import React, { useState, useMemo } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import { Box, Button } from "@material-ui/core";

const ExtraProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    onClone,
  } = props;
  const AllowedLayerTypes = useMemo(
    () =>
      values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );

  if (!AllowedLayerTypes.includes("clone")) return <></>;
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {AllowedLayerTypes.includes("clone") ? (
        <Button variant="outlined" onClick={onClone}>
          Clone
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default React.memo(ExtraProperty);
