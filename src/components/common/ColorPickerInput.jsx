import React, { useCallback } from "react";
import useInterval from "react-useinterval";
import { ColorPicker } from "material-ui-color";
import { Box, TextField, Typography } from "@material-ui/core";
import { Palette } from "constant";
import styled from "styled-components";

const CustomColorPicker = styled(ColorPicker)`
  &.ColorPicker-MuiButton-contained {
    margin-left: 0;
  }
`;
const CustomTextField = styled(TextField)`
  .MuiInputBase-input {
    padding: 0;
    text-align: right;
  }
`;

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
    fullWidth = true,
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="40px"
      justifyContent="space-between"
      width={fullWidth ? "100%" : "auto"}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width={fullWidth ? "100%" : "auto"}
      >
        {disabled ? (
          <Box
            width="24px"
            height="24px"
            bgcolor={value || "white"}
            borderRadius="5px"
            m="4px"
          ></Box>
        ) : (
          <CustomColorPicker
            value={separateValues ? valuePicker : value || "#"}
            onChange={(color) =>
              onChange(color.error ? "" : color.css.backgroundColor)
            }
            palette={Palette}
            deferred
            hideTextfield
          />
        )}

        <CustomTextField
          value={value || ""}
          disabled={disabled}
          style={{ width: 85, borderBottom: "1px solid white", padding: 0 }}
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
