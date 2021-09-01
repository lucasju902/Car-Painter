import React from "react";
import { MouseModes } from "constant";
import { useSelector } from "react-redux";

import { Box, Typography } from "@material-ui/core";
import { useStyles } from "./BoardGuide.style";

export const BoardGuide = () => {
  const classes = useStyles();

  const drawingStatus = useSelector(
    (state) => state.layerReducer.drawingStatus
  );
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);

  return (
    <Box
      position="absolute"
      left={0}
      top="10px"
      width="100%"
      display="flex"
      justifyContent="center"
      className={classes.noPointerEvents}
    >
      {!drawingStatus &&
      [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
        mouseMode
      ) ? (
        <Box
          bgcolor="#666"
          p="8px 16px"
          borderRadius={10}
          border="2px solid navajowhite"
          className={classes.noPointerEvents}
        >
          <Typography className={classes.noPointerEvents}>
            Double-Click or Press Enter to finish drawing
          </Typography>
          <Typography className={classes.noPointerEvents}>
            You can also Press Esc to cancel/remove drawing.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
