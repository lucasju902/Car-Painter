import styled from "styled-components/macro";

import { Menu } from "@material-ui/core";
import { MoreVert as ActionIcon } from "@material-ui/icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";

export const StyledMenu = styled(Menu)`
  .MuiMenu-paper {
    border: 1px solid grey;
  }
`;

export { ActionIcon, faStarOn, faStarOff };
