import styled from "styled-components/macro";
import { Box, Input, Grid } from "@material-ui/core";

export const CustomInput = styled(Input)`
  .MuiInputBase-inputMarginDense {
    padding-top: 4px;
    padding-bottom: 5px;
    width: 50px;
  }
`;
export const SliderWrapper = styled(Box)`
  width: 80px;
  margin-left: 8px;
  margin-right: 8px;
  height: 28px;
`;
export const Wrapper = styled(Grid)`
  height: 100%;
  align-items: center;
`;
