import React from "react";
import styled from "styled-components/macro";
import {
  Popover,
  Box,
  Typography,
  Button,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";

const CustomOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 100px !important;
  }
  .MuiOutlinedInput-input {
    padding: 6px 14px;
    border-bottom: none;
    width: 40px;
  }
`;

const ZoomPopover = ({
  anchorEl,
  zoom,
  setZoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onClose,
}) => {
  const handleZoomChange = (event) => {
    setZoom(parseInt(event.target.value || 0) / 100.0);
  };
  const handleZoom100 = () => {
    setZoom(1);
  };

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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={onZoomIn}>Zoom in</Button>
          <Typography variant="body2">Shift +</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={onZoomOut}>Zoom out</Button>
          <Typography variant="body2">Shift -&nbsp;</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
          labelWidth={0}
          autoFocus={true}
        />
      </Box>
    </Popover>
  );
};

export default ZoomPopover;
