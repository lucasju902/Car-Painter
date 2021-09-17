import React, { useCallback } from "react";

import {
  Popover,
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
} from "components/MaterialUI";

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
          <Button onClick={onZoomIn}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <span>Zoom in</span>
              <span>Shift +</span>
            </Box>
          </Button>

          <Button onClick={onZoomOut}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <span>Zoom out</span>
              <span>Shift -&nbsp;</span>
            </Box>
          </Button>

          <Button onClick={onZoomFit}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <span>Zoom to fit</span>
              <span>Shift 9</span>
            </Box>
          </Button>

          <Button onClick={handleZoom100} mb={1}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <span>Zoom to 100%</span>
              <span>Shift 0</span>
            </Box>
          </Button>

          <OutlinedInput
            id="zoom-value"
            value={zoom * 100}
            onChange={handleZoomChange}
            onFocus={handleFocus}
            onKeyDown={handleZoomKeyDown}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            labelWidth={0}
            width="100%"
            autoFocus={true}
          />
        </Box>
      </Popover>
    );
  }
);

export default ZoomPopover;
