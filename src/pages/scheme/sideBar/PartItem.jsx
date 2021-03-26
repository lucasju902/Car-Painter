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
    onClick,
  } = props;

  return (
    <Wrapper
      p={2}
      mb={1}
      display="flex"
      justifyContent="space-between"
      width="100%"
      border={1}
      borderColor="grey.700"
      borderRadius={5}
      onClick={onClick}
      className={clsx(selected && "activeItem")}
    >
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => toggleVisible()} size="small">
          {layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
        <Typography>{text}</Typography>
      </Box>
      {!disableLock ? (
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => toggleLocked()} size="small">
            {layer_locked ? <LockIcon /> : <LockOpenIcon />}
          </IconButton>
        </Box>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default PartItem;
