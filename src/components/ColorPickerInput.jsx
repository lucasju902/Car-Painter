import React, { useCallback } from "react";
import { ColorPicker } from "material-ui-color";
import { Box, TextField, Typography } from "@material-ui/core";
import { Palette } from "constant";
import styled from "styled-components/macro";

const ColorInputField = styled(TextField)`
  width: 80px;
`;

const ColorPickerInput = (props) => {
  const { value, onChange, onInputChange, error, helperText } = props;

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        onChange(event.target.value);
      }
    },
    [onChange]
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
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
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </Box>
      {error ? (
        <Typography color="secondary" variant="body2">
          {helperText}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ColorPickerInput;
