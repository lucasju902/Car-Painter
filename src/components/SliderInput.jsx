import React from "react";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Slider,
  Tooltip,
  Box,
  Typography as MuiTypography,
  Input,
} from "@material-ui/core";
const Typography = styled(MuiTypography)(spacing);
const CustomInput = styled(Input)`
  .MuiInputBase-inputMarginDense {
    padding-top: 4px;
    padding-bottom: 5px;
    width: 50px;
  }
`;
const SliderWrapper = styled(Box)`
  width: 80px;
  margin-left: 8px;
  margin-right: 8px;
  height: 28px;
`;

const SliderInput = (props) => {
  const { label, min, max, value, setValue, width } = props;
  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" color="textSecondary" mr={2}>
        {label}
      </Typography>
      <Box display="flex" alignItems="center">
        <SliderWrapper>
          <Slider
            min={min}
            max={max}
            value={value}
            onChange={(event, value) => setValue(value)}
            aria-labelledby="shape-size"
            ValueLabelComponent={(props) => (
              <Tooltip
                open={props.open}
                enterTouchDelay={0}
                placement="top"
                title={props.value}
              >
                {props.children}
              </Tooltip>
            )}
          />
        </SliderWrapper>
        <CustomInput
          value={value}
          margin="dense"
          onChange={(event) =>
            setValue(
              event.target.value === "" ? min || 0 : Number(event.target.value)
            )
          }
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: min,
            max: max,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </Box>
    </Box>
  );
};

export default SliderInput;
