import React from "react";
import styled from "styled-components/macro";

import {
  Box,
  Checkbox,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import SliderInput from "components/SliderInput";

const TitleTypograhpy = styled(Typography)`
  margin-top: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid gray;
  padding-bottom: 5px;
`;

const RotationProperty = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
  return (
    <Box display="flex" flexDirection="column">
      <TitleTypograhpy>Rotation</TitleTypograhpy>
      <SliderInput
        label="Rotation"
        width={80}
        min={-179}
        max={179}
        value={Math.round(values.layer_data.rotation)}
        setValue={(value) => setFieldValue("layer_data.rotation", value)}
      />
      <Box display="flex" justifyContent="space-around">
        <FormControl component="fieldset">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(values.layer_data.flop)}
                onChange={(event) =>
                  setFieldValue("layer_data.flop", event.target.checked ? 1 : 0)
                }
              />
            }
            label="Flop"
            labelPlacement="start"
          />
        </FormControl>
        <FormControl component="fieldset">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(values.layer_data.flip)}
                onChange={(event) =>
                  setFieldValue("layer_data.flip", event.target.checked ? 1 : 0)
                }
              />
            }
            label="Flip"
            labelPlacement="start"
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default RotationProperty;
