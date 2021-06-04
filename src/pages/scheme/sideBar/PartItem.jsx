import React, { useEffect, useRef, useCallback } from "react";
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
const SmallIconButton = styled(IconButton)`
  .MuiSvgIcon-root {
    width: 18px;
    height: 18px;
  }
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

  const wrapperRef = useRef(null);

  const handleToggleVisible = useCallback(
    (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      toggleVisible();
    },
    [toggleVisible]
  );

  const handleToggleLock = useCallback(
    (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      toggleLocked();
    },
    [toggleVisible]
  );

  return (
    <Wrapper
      ref={wrapperRef}
      px={2}
      py={1}
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
        <CustomTypography
          variant="body2"
          active={layer_visible ? "true" : "false"}
          noWrap
        >
          {text}
        </CustomTypography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!disableLock && (selected || hovered || layer_locked) ? (
            <Box mr={1}>
              <SmallIconButton onClick={handleToggleLock} size="small">
                {layer_locked ? <LockIcon /> : <LockOpenIcon />}
              </SmallIconButton>
            </Box>
          ) : (
            <Box width="24px" height="24px" mr={1}></Box>
          )}
          {selected || hovered || !layer_visible ? (
            <SmallIconButton onClick={handleToggleVisible} size="small">
              {layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </SmallIconButton>
          ) : (
            <Box width="24px" height="24px"></Box>
          )}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default React.memo(PartItem);
