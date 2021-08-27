import styled from "styled-components/macro";
import { OutlinedInput } from "@material-ui/core";

export const CustomOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 100px !important;
  }
  .MuiOutlinedInput-input {
    padding: 6px 14px;
    border-bottom: none;
    width: 40px;
  }
`;
