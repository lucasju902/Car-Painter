import styled from "styled-components/macro";

import { IconButton } from "@material-ui/core";
import { Link as LinkIcon, LinkOff as LinkOfficon } from "@material-ui/icons";

export const CustomIconButton = styled(IconButton)`
  margin: 5px 5px 0;
  height: 40px;
  background: ${(props) => (props.locked ? "#15151580" : "")};
`;

export { LinkIcon, LinkOfficon };
