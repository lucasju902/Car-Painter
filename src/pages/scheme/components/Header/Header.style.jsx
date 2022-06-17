import styled from "styled-components/macro";

import { Button, ButtonGroup } from "@material-ui/core";
import {
  ArrowDropDown as DropDownIcon,
  Share as ShareIcon,
} from "@material-ui/icons";

export { DropDownIcon, ShareIcon };

export const CustomButtonGroup = styled(ButtonGroup)`
  height: 30px;
  margin: 0 8px;
`;

export const DownloadButton = styled(Button)`
  padding-left: 12px;
  height: 30px;
  & .MuiButton-startIcon svg {
    font-size: 14px;
  }
`;
