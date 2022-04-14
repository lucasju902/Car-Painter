import styled from "styled-components/macro";

import { Box, MenuItem } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Wrapper = styled(Box)`
  background: #666666;
  padding: 0px 10px 10px 10px;
`;
export const ToolWrapper = styled(Box)`
  border-radius: 5px;
  padding: 5px 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const CustomDrawingItem = styled(MenuItem)`
  display: flex;
  justify-content: center;
  padding: 7px 10px;
  height: 30px;
  min-height: 30px;
  width: 100%;
  background-color: ${(props) =>
    props.active === "true" ? "rgba(255, 255, 255, 0.08)" : "none"};
`;

export const MainItem = styled(MenuItem)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 5px;
  height: 65px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid transparent;
  margin-bottom: 10px;
  &:hover {
    background: #444;
    border: 1px solid gray;
  }
`;

export const ShapeItem = styled(MenuItem)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 5px;
  height: 65px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid transparent;
  &:hover {
    background: #444;
    border: 1px solid gray;
  }
  ${(props) =>
    props.active
      ? `
    background: #444;
    border: 1px solid gray;
    border-bottom: 1px solid transparent !important;
    border-radius: 8px 8px 0 0;
  `
      : `
    margin-bottom: 10px;
  `}
`;

export const ShapeWrapper = styled(Box)`
  background: #444;
  border: 1px solid gray;
  border-top: none;
  border-radius: 0 0 8px 8px;
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;
