import styled from "styled-components/macro";

import { Button } from "@material-ui/core";
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  KeyboardArrowUp as ArrowUpIcon,
} from "@material-ui/icons";

export { UndoIcon, RedoIcon, ArrowUpIcon };

export const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  padding: 10px 20px;
  background: #151515;
  z-index: 1201;
`;

export const ZoomButton = styled(Button)`
  &.MuiButton-contained {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.12);
  }
`;
