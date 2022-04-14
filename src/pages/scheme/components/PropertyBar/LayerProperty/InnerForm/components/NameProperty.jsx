import React, { useMemo, useCallback } from "react";
import styled from "styled-components/macro";
import { AllowedLayerProps, LayerTypes } from "constant";

import { Box, Button, TextField } from "@material-ui/core";

const CustomeTextField = styled(TextField)`
  margin: 0;
  .MuiInputBase-input {
    height: 1.5rem;
  }
  [disabled] {
    color: white;
  }
`;

export const NameProperty = React.memo((props) => {
  const {
    user,
    editable,
    errors,
    isValid,
    checkLayerDataDirty,
    handleBlur,
    handleChange,
    touched,
    values,
    layerType,
  } = props;
  const layerDataProperties = ["name"];
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );
  const layerName = useCallback(
    (name, type) => {
      if (type === LayerTypes.UPLOAD && name.indexOf(user.id.toString()) === 0)
        return name.slice(user.id.toString().length + 1);
      return name;
    },
    [user]
  );
  if (JSON.stringify(errors) !== "{}") {
    console.log(errors);
  }

  if (
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <>
      {AllowedLayerTypes.includes("layer_data.name") ? (
        <Box
          display="flex"
          justifyContent="space-bewteen"
          width="100%"
          alignItems="center"
        >
          <CustomeTextField
            name="layer_data.name"
            value={layerName(values.layer_data.name, values.layer_type)}
            disabled={!editable || layerType === LayerTypes.CAR}
            error={Boolean(
              touched.layer_data &&
                touched.layer_data.name &&
                errors.layer_data &&
                errors.layer_data.name
            )}
            helperText={
              touched.layer_data &&
              touched.layer_data.name &&
              errors.layer_data &&
              errors.layer_data.name
            }
            onBlur={handleBlur}
            onChange={handleChange}
            fullWidth
            margin="normal"
            mb={4}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {editable && isValid && checkLayerDataDirty(layerDataProperties) ? (
            <Box height="30px">
              <Button type="submit" color="primary" variant="outlined">
                Apply
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
});
