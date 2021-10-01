import React, { useState, useCallback } from "react";
import clsx from "clsx";

import { Box, IconButton, Popover } from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import { LightTooltip } from "components/common";

import { EnglishLang } from "constant/language";
import { useStyles, CustomFontAwesomeIcon } from "./PartAction.style";

export const PartAction = (props) => {
  const classes = useStyles();
  const { expanded, actions, onExpandClick } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePoperOpen = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClosePoper = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <Box display="flex">
      <IconButton
        onClick={onExpandClick}
        className={clsx(classes.expand, {
          [classes.expandOpen]: expanded,
        })}
      >
        <ExpandMoreIcon />
      </IconButton>
      {!actions ? (
        <></>
      ) : actions.length === 1 ? (
        <LightTooltip title={actions[0].title} arrow>
          <IconButton onClick={actions[0].onClick} variant="text">
            <AddIcon />
          </IconButton>
        </LightTooltip>
      ) : (
        <>
          <LightTooltip title={EnglishLang.INSERT_LOGO_OR_TEXT} arrow>
            <IconButton onClick={handlePoperOpen}>
              <AddIcon />
            </IconButton>
          </LightTooltip>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClosePoper}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              border="1px solid gray"
              borderRadius={5}
              p={1}
            >
              {actions.map((action, index) => (
                <LightTooltip title={action.title} key={index} arrow>
                  <IconButton onClick={action.onClick} variant="text">
                    <CustomFontAwesomeIcon icon={action.icon} />
                  </IconButton>
                </LightTooltip>
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default PartAction;
