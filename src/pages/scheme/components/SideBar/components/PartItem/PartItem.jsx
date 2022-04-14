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
    item,
    layer_visible,
    layer_locked,
    text,
    selected,
    disabled,
    disableLock,
    onSelect,
    onDoubleClick,
    hovered,
    onHover,
    toggleField,
  } = props;

  const wrapperRef = useRef(null);

  const handleToggleVisible = useCallback(
    (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      toggleField(item.id, "layer_visible");
    },
    [item.id, toggleField]
  );

  const handleToggleLock = useCallback(
    (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      toggleField(item.id, "layer_locked");
    },
    [item.id, toggleField]
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(item);
    },
    [item, onSelect]
  );

  return (
    <Wrapper
      ref={wrapperRef}
      px={2}
      py={0.5}
      display="flex"
      width="100%"
      borderBottom="1px solid gray"
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => onHover(item, true)}
      onMouseLeave={() => onHover(item, false)}
      className={clsx(selected && "activeItem", hovered && "hoveredItem")}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        height="24px"
      >
        <CustomTypography
          variant="body2"
          active={layer_visible ? "true" : "false"}
          noWrap
        >
          {text}
        </CustomTypography>
        {selected || hovered || layer_locked ? (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {!disableLock && !disabled ? (
              <Box mr={1}>
                <SmallIconButton onClick={handleToggleLock} size="small">
                  {layer_locked ? <LockIcon /> : <LockOpenIcon />}
                </SmallIconButton>
              </Box>
            ) : (
              <Box width="24px" height="24px" mr={1}></Box>
            )}
            {!disabled ? (
              <SmallIconButton onClick={handleToggleVisible} size="small">
                {layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </SmallIconButton>
            ) : (
              <Box width="24px" height="24px"></Box>
            )}
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Wrapper>
  );
});

export default PartItem;
