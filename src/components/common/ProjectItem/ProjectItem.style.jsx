import styled from "styled-components/macro";

import { Typography } from "@material-ui/core";
import { MoreVert as ActionIcon } from "@material-ui/icons";
import { faStar as faStarOn } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOff } from "@fortawesome/free-regular-svg-icons";

export const BreakableTypography = styled(Typography)`
  word-break: break-word;
  line-height: 1.2;
`;

export { ActionIcon, faStarOn, faStarOff };
