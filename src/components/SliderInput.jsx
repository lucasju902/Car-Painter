import React, { useCallback } from "react";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  Slider,
  Tooltip,
  Box,
  Typography as MuiTypography,
  Input,
  Grid,
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
const Wrapper = styled(Grid)`
  height: 100%;
  align-items: center;
`;

const SliderInput = (props) => {
  const { label, min, max, value, setValue, step } = props;

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
            type="number"
            step={step || 1}
            onChange={(event) =>
              setValue(
                event.target.value === ""
                  ? min || 0
                  : Number(event.target.value)
              )
            }
            onBlur={handleBlur}
            inputProps={{
              min: min,
              max: max,
              "aria-labelledby": "input-slider",
            }}
          />
        </Box>
      </Grid>
    </Wrapper>
  );
};

export default SliderInput;
