import React from "react";
import { ColorPicker } from "material-ui-color";
import { Box, TextField } from "@material-ui/core";
import { Palette } from "constant";
import styled from "styled-components/macro";

const ColorInputField = styled(TextField)`
  width: 80px;
`;

const ColorPickerInput = (props) => {
  const { value, onChange } = props;

  return (
    <Box display="flex" alignItems="center">
      <ColorPicker
        value={value || ""}
        onChange={(color) => onChange(color.css.backgroundColor)}
        palette={Palette}
        deferred
        hideTextfield
      />
      <ColorInputField
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </Box>
  );
};

export default ColorPickerInput;
