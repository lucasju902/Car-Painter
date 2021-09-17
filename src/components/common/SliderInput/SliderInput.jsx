import React, { useCallback } from "react";
import { Slider, Tooltip, Box, Grid, Typography } from "components/MaterialUI";
import { CustomInput, SliderWrapper, Wrapper } from "./SliderInput.style";

export const SliderInput = (props) => {
  const { label, disabled, min, max, value, setValue, step } = props;

  const handleBlur = useCallback(() => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  }, [value, min, max, setValue]);

  return (
    <Wrapper container>
      <Grid item xs={6}>
        <Typography variant="body1" color="textSecondary" mr={2}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center">
          <SliderWrapper>
            <Slider
              min={min}
              max={max}
              step={step}
              value={value}
              disabled={disabled}
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
            disabled={disabled}
            margin="dense"
            type="number"
            onChange={(event) =>
              setValue(
                event.target.value === ""
                  ? Math.max(min, 0)
                  : Number(event.target.value)
              )
            }
            onBlur={handleBlur}
            inputProps={{
              min: min,
              max: max,
              step: step || 1,
              "aria-labelledby": "input-slider",
            }}
          />
        </Box>
      </Grid>
    </Wrapper>
  );
};

export default SliderInput;
