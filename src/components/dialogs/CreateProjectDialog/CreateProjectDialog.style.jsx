import styled from "styled-components/macro";
import { DialogActions, TextField } from "components/MaterialUI";

export const CarMakeLabel = styled(TextField)`
  .MuiInputLabel-outlined {
    transform: translate(14px, 19px) scale(1);
  }
  .MuiInputLabel-shrink {
    transform: translate(14px, -6px) scale(0.75);
  }
`;
export const CustomDialogActions = styled(DialogActions)`
  padding-right: 24px;
`;
export const NameField = styled(TextField)`
  .MuiInputBase-root {
    height: 56px;
  }
`;
