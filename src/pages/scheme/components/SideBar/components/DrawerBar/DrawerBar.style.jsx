import styled from "styled-components/macro";

import { Box, MenuItem } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Wrapper = styled(Box)`
  background: #666666;
  padding: 0px 10px 10px 10px;
`;
export const ToolWrapper = styled(Box)`
  background: #444;
  border-radius: 5px;
  padding: 5px 1px;
`;
export const CustomDrawingItem = styled(MenuItem)`
  display: flex;
  justify-content: center;
  padding: 7px 10px;
  height: 30px;
  min-height: 30px;
  background-color: ${(props) =>
    props.active === "true" ? "rgba(255, 255, 255, 0.08)" : "none"};
`;
export const CustomItem = styled(MenuItem)`
  display: flex;
  justify-content: center;
  padding: 7px 10px;
  min-height: 30px;
  background-color: ${(props) =>
    props.active === "true" ? "rgba(255, 255, 255, 0.08)" : "none"};
`;

export const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;

export const DefaultSettingsButton = styled(Box)`
  outline: ${(props) => props.outline};
  cursor: pointer;
`;
