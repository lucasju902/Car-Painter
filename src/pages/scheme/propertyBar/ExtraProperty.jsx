import React, { useMemo } from "react";

import { AllowedLayerProps, LayerTypes } from "constant";

import { Box, Button } from "@material-ui/core";

const ExtraProperty = (props) => {
  const {
    editable,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    onClone,
    onDelete,
  } = props;
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );

  if (
    !AllowedLayerTypes.includes("clone") &&
    !AllowedLayerTypes.includes("delete")
  )
    return <></>;
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {editable && AllowedLayerTypes.includes("clone") ? (
        <Button variant="outlined" onClick={onClone}>
          Clone
        </Button>
      ) : (
        <></>
      )}
      {editable && AllowedLayerTypes.includes("delete") ? (
        <Box width="100%" mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default React.memo(ExtraProperty);
