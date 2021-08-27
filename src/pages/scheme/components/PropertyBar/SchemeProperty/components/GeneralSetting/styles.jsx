import styled from "styled-components/macro";
import { Button, DialogContent, TextField } from "components/MaterialUI";

export const CustomDialogContent = styled(DialogContent)`
  padding: 0;
`;

export const CustomButton = styled(Button)`
  font-size: 16px;
  font-weight: 400;
`;

export const NameInput = styled(TextField)`
  width: ${(props) => props.width};
`;
