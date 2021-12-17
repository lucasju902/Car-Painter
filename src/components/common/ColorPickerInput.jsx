import React, { useCallback } from "react";
import useInterval from "react-useinterval";
import { ColorPicker } from "material-ui-color";
import { Box, TextField, Typography } from "@material-ui/core";
import { Palette } from "constant";

export const ColorPickerInput = React.memo((props) => {
  const {
    separateValues,
    valuePicker,
    value,
    disabled,
    onChange,
    onInputChange,
    error,
    helperText,
  } = props;

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        onChange(event.target.value);
      }
    },
    [onChange]
  );

  const handleHexInputKeyDown = useCallback((event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target
        .closest(".MuiPaper-root")
        .getElementsByClassName("muicc-colorbox-controls")[0]
        .children[0].click();
    }
  }, []);

  useInterval(() => {
    const hexInput = document.getElementById("hex");
    if (hexInput && !hexInput.onkeydown)
      hexInput.onkeydown = handleHexInputKeyDown;
  }, [200]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        {disabled ? (
          <Box
            width="24px"
            height="24px"
            bgcolor={value || "white"}
            borderRadius="5px"
            m="4px"
          ></Box>
        ) : (
          <ColorPicker
            value={separateValues ? valuePicker : value || "#"}
            onChange={(color) =>
              onChange(color.error ? "" : color.css.backgroundColor)
            }
            palette={Palette}
            deferred
            hideTextfield
          />
        )}

        <TextField
          value={value || ""}
          disabled={disabled}
          style={{ width: 85 }}
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
});

export default ColorPickerInput;
