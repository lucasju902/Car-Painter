import styled from "styled-components/macro";

import { IconButton } from "components/MaterialUI";
import {
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
} from "@material-ui/icons";

export { RotateLeftIcon, RotateRightIcon };

export const RotationButton = styled(IconButton)`
  background: black;
  border-radius: 0;
  &:hover {
    background: #444;
  }
`;
