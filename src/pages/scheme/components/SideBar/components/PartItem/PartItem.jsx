import React, { useRef, useCallback } from "react";
import clsx from "clsx";

import { Box } from "@material-ui/core";
import { Wrapper, CustomTypography, SmallIconButton } from "./PartItem.style";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@material-ui/icons";

export const PartItem = React.memo((props) => {
  const {
    layer_visible,
    layer_locked,
    text,
    toggleVisible,
    toggleLocked,
    selected,
    disabled,
    disableLock,
    onSelect,
    onDoubleClick,
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
      onDoubleClick={onDoubleClick}
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
          {!disableLock &&
          !disabled &&
          (selected || hovered || layer_locked) ? (
            <Box mr={1}>
              <SmallIconButton onClick={handleToggleLock} size="small">
                {layer_locked ? <LockIcon /> : <LockOpenIcon />}
              </SmallIconButton>
            </Box>
          ) : (
            <Box width="24px" height="24px" mr={1}></Box>
          )}
          {!disabled && (selected || hovered || !layer_visible) ? (
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
});

export default PartItem;
