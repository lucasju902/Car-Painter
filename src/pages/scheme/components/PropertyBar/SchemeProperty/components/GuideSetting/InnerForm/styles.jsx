import styled from "styled-components/macro";
import { DialogContent, FormControlLabel } from "components/MaterialUI";

export const CustomFormControlLabel = styled(FormControlLabel)`
  margin-left: 0;
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const CustomDialogContent = styled(DialogContent)`
  padding-right: 0;
`;
