import React, { useCallback } from "react";

import {
  Popover,
  Box,
  Typography,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { CustomOutlinedInput } from "./ZoomPopover.style";

export const ZoomPopover = React.memo(
  ({ anchorEl, zoom, setZoom, onZoomIn, onZoomOut, onZoomFit, onClose }) => {
    const handleZoomKeyDown = useCallback(
      (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          onClose();
        }
      },
      [onClose]
    );
    const handleZoomChange = useCallback(
      (event) => {
        setZoom(parseInt(event.target.value || 0) / 100.0);
      },
      [setZoom]
    );

    const handleFocus = useCallback((event) => event.target.select(), []);

    const handleZoom100 = useCallback(() => {
      setZoom(1);
    }, [setZoom]);

    return (
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box display="flex" flexDirection="column" p={4} width="200px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button onClick={onZoomIn}>Zoom in</Button>
            <Typography variant="body2">Shift +</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button onClick={onZoomOut}>Zoom out</Button>
            <Typography variant="body2">Shift -&nbsp;</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button onClick={onZoomFit}>Zoom to fit</Button>
            <Typography variant="body2">Shift 9</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Button onClick={handleZoom100}>Zoom to 100%</Button>
            <Typography variant="body2">Shift 0</Typography>
          </Box>
          <CustomOutlinedInput
            id="zoom-value"
            value={zoom * 100}
            onChange={handleZoomChange}
            onFocus={handleFocus}
            onKeyDown={handleZoomKeyDown}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            labelWidth={0}
            autoFocus={true}
          />
        </Box>
      </Popover>
    );
  }
);

export default ZoomPopover;
