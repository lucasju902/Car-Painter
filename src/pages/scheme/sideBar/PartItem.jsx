import React, { useState } from "react";
import clsx from "clsx";
import styled from "styled-components/macro";

import { Box, Grid, IconButton, Typography } from "@material-ui/core";
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
  } = props;
  const [hover, setHover] = useState(false);

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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={clsx(selected && "activeItem", hover && "hoveredItem")}
    >
      <Grid container justify="space-between" alignItems="center" spacing={2}>
        <Grid item xs={disableLock ? 12 : 10}>
          <Grid container wrap="nowrap" alignItems="center" spacing={2}>
            <Grid item xs={10}>
              <CustomTypography
                active={layer_visible ? "true" : "false"}
                noWrap
              >
                {text}
              </CustomTypography>
            </Grid>
            {selected || hover || !layer_visible ? (
              <Grid item xs={2}>
                <IconButton onClick={handleToggleVisible} size="small">
                  {layer_visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
        {!disableLock && (selected || hover || layer_locked) ? (
          <Grid item xs={2}>
            <IconButton onClick={handleToggleLock} size="small">
              {layer_locked ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </Wrapper>
  );
};

export default PartItem;
