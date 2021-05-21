import React from "react";
import clsx from "clsx";
import styled from "styled-components/macro";

import { Box, IconButton, Typography } from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@material-ui/icons";

const Wrapper = styled(Box)`
  cursor: pointer;
  &.sortable-chosen {
    background: rgba(255, 255, 255, 0.2);
  }
  &.activeItem {
    background: rgba(0, 0, 0, 0.5);
  }
  &.hoveredItem {
    background: rgba(0, 0, 0, 0.2);
  }
`;
const CustomTypography = styled(Typography)`
  color: ${(props) => (props.active === "true" ? "white" : "darkgray")};
`;

const PartItem = (props) => {
  const {
    layer_visible,
    layer_locked,
    text,
    toggleVisible,
    toggleLocked,
    selected,
    disableLock,
    onSelect,
    hovered,
    onHover,
  } = props;

  const handleToggleVisible = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    toggleVisible();
  };

  const handleToggleLock = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    toggleLocked();
  };

  return (
    <Wrapper
      p={2}
      mb={1}
      display="flex"
      width="100%"
      border={1}
      borderColor="grey.700"
      borderRadius={5}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={clsx(selected && "activeItem", hovered && "hoveredItem")}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <CustomTypography active={layer_visible ? "true" : "false"} noWrap>
          {text}
        </CustomTypography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!disableLock && (selected || hovered || layer_locked) ? (
            <Box mr={1}>
              <IconButton onClick={handleToggleLock} size="small">
                {layer_locked ? <LockIcon /> : <LockOpenIcon />}
              </IconButton>
            </Box>
          ) : (
            <Box width="28.28px" height="28.28px"></Box>
          )}
          {selected || hovered || !layer_visible ? (
            <IconButton onClick={handleToggleVisible} size="small">
              {layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          ) : (
            <Box width="28.28px" height="28.28px"></Box>
          )}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default PartItem;
