import React from "react";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import {
  setZoom,
  historyActionBack,
  historyActionUp,
} from "redux/reducers/boardReducer";

import { spacing } from "@material-ui/system";
import {
  IconButton as MuiIconButton,
  Typography as MuiTypography,
  Box,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import {
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";
import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from "react-feather";
import { Undo as UndoIcon, Redo as RedoIcon } from "@material-ui/icons";

import { PaintingGuides } from "constant";
import LightTooltip from "components/LightTooltip";

const Typography = styled(MuiTypography)(spacing);
const ToggleButton = styled(MuiToggleButton)(spacing);
const IconButton = styled(MuiIconButton)(spacing);

const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  padding: 10px 20px;
  background: #151515;
  z-index: 1201;
`;
const CustomOutlinedInput = styled(OutlinedInput)`
  .MuiOutlinedInput-input {
    padding: 6px 14px;
    border-bottom: none;
    width: 40px;
  }
`;

const Toolbar = (props) => {
  const { onZoomIn, onZoomOut, onChangePaintingGuides } = props;

  const dispatch = useDispatch();
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );
  const actionHistoryIndex = useSelector(
    (state) => state.boardReducer.actionHistoryIndex
  );
  const actionHistory = useSelector(
    (state) => state.boardReducer.actionHistory
  );
  const zoom = useSelector((state) => state.boardReducer.zoom);

  const handleChangePaintingGuides = (event, newFormats) => {
    onChangePaintingGuides(newFormats);
  };

  const handleZoomChange = (event) => {
    dispatch(setZoom(parseInt(event.target.value || 0) / 100.0));
  };

  const handleUndoRedo = (isUndo = true) => {
    if (isUndo) {
      dispatch(historyActionBack());
    } else {
      dispatch(historyActionUp());
    }
  };

  return (
    <Wrapper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        width="100%"
      >
        <Box display="flex" justifyContent="start" alignContent="center">
          <ToggleButtonGroup
            value={paintingGuides}
            onChange={handleChangePaintingGuides}
            aria-label="Painting Guides"
          >
            <ToggleButton value={PaintingGuides.CARMASK} aria-label="car-mask">
              <Typography variant="caption">car mask</Typography>
            </ToggleButton>
            <ToggleButton
              value={PaintingGuides.WIREFRAME}
              aria-label="wireframe"
            >
              <Typography variant="caption">wireframe</Typography>
            </ToggleButton>
            <ToggleButton
              value={PaintingGuides.SPONSORBLOCKS}
              aria-label="sponsor-blocks"
            >
              <Typography variant="caption">sponsor blocks</Typography>
            </ToggleButton>
            <ToggleButton
              value={PaintingGuides.NUMBERBLOCKS}
              aria-label="number-blocks"
            >
              <Typography variant="caption">number blocks</Typography>
            </ToggleButton>
            <ToggleButton value={PaintingGuides.GRID} aria-label="grid">
              <Typography variant="caption">grid</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignContent="center">
          <LightTooltip title="Undo" arrow>
            <IconButton
              disabled={actionHistoryIndex === -1}
              onClick={() => handleUndoRedo(true)}
            >
              <UndoIcon />
            </IconButton>
          </LightTooltip>

          <LightTooltip title="Redo" arrow>
            <IconButton
              disabled={actionHistoryIndex === actionHistory.length - 1}
              onClick={() => handleUndoRedo(false)}
            >
              <RedoIcon />
            </IconButton>
          </LightTooltip>

          <IconButton onClick={onZoomOut}>
            <ZoomOutIcon />
          </IconButton>
          <IconButton onClick={onZoomIn} mr={1}>
            <ZoomInIcon />
          </IconButton>
          <CustomOutlinedInput
            id="zoom-value"
            value={zoom * 100}
            onChange={handleZoomChange}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            // inputProps={{
            //   "aria-label": "weight",
            // }}
            labelWidth={0}
          />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default Toolbar;
