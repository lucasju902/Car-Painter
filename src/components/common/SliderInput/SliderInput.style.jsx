import styled from "styled-components/macro";
import { Box, Input, Grid } from "@material-ui/core";

export const CustomInput = styled(Input)`
  .MuiInputBase-inputMarginDense {
    padding: 0;
    margin-left: 10px;
    width: 45px;
    text-align: right;
    border-bottom: 1px solid white;
  }
`;
export const SliderWrapper = styled(Box)`
  width: 80px;
  margin-left: 0px;
  margin-right: 0px;
  height: 28px;
`;
export const Wrapper = styled(Grid)`
  height: 40px;
  align-items: center;
`;
