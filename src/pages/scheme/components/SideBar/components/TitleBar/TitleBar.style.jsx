import styled from "styled-components/macro";

import { TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CustomIcon = styled(FontAwesomeIcon)`
  width: 20px !important;
`;

export const NameInput = styled(TextField)`
  width: ${(props) => props.width};
`;
