import React from "react";

import { NavLink } from "react-router-dom";
import { Box, Typography, IconButton } from "@material-ui/core";
import { HighlightOff as CloseIcon } from "@material-ui/icons";
import { useStyles } from "./LegacyBanner.style";

export const LegacyBanner = React.memo(({ show, carMakeID, onDismiss }) => {
  const classes = useStyles();

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      top="10px"
      width="500px"
      display="flex"
      justifyContent="center"
      margin="auto"
    >
      {show ? (
        <Box
          bgcolor="#666"
          p="15px 45px 15px 20px"
          borderRadius={10}
          border="2px solid navajowhite"
          position="relative"
        >
          <Box position="absolute" right="5px" top="5px">
            <IconButton size="small" onClick={onDismiss}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography>
            This project was created with an old version of Paint Builder.
          </Typography>
          <Typography>
            <NavLink to={`/?make=${carMakeID}`} className={classes.link}>
              Create a new project to design using the latest features.
            </NavLink>
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
});
