import styled from "styled-components/macro";
import { Button, DialogContent, TextField } from "components/MaterialUI";
import { Info as MuiInfoIcon } from "@material-ui/icons";

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

export const InfoIcon = styled(MuiInfoIcon)`
  margin-top: 5px;
  margin-right: 3px;
  width: 20px;
  height: 20px;
`;
