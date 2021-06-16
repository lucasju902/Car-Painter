import React, { useState, useCallback } from "react";
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
  Button,
} from "@material-ui/core";
import {
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  KeyboardArrowUp as ArrowUpIcon,
} from "@material-ui/icons";

import { PaintingGuides } from "constant";
import LightTooltip from "components/LightTooltip";
import ZoomPopover from "dialogs/ZoomPopover";

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
const ZoomButton = styled(Button)`
  &.MuiButton-contained {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

const Toolbar = React.memo((props) => {
  const {
    onZoomIn,
    onZoomOut,
    onZoomFit,
    onChangePaintingGuides,
    onDownloadTGA,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleChangePaintingGuides = useCallback(
    (event, newFormats) => {
      onChangePaintingGuides(newFormats);
    },
    [onChangePaintingGuides]
  );

  const handleUndoRedo = useCallback(
    (isUndo = true) => {
      if (isUndo) {
        dispatch(historyActionBack());
      } else {
        dispatch(historyActionUp());
      }
    },
    [dispatch]
  );

  const handleZoomPoperOpen = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleCloseZoomPoper = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleZoom = useCallback(
    (value) => {
      dispatch(setZoom(value));
    },
    [dispatch]
  );

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
              <LightTooltip title="Toggle Car Mask Guide (HotKey: 1)" arrow>
                <Typography variant="caption">car mask</Typography>
              </LightTooltip>
            </ToggleButton>
            <ToggleButton
              value={PaintingGuides.WIREFRAME}
              aria-label="wireframe"
            >
              <LightTooltip title="Toggle Wireframe Guide (HotKey: 2)" arrow>
                <Typography variant="caption">wireframe</Typography>
              </LightTooltip>
            </ToggleButton>
            <ToggleButton
              value={PaintingGuides.SPONSORBLOCKS}
              aria-label="sponsor-blocks"
            >
              <LightTooltip
                title="Toggle Sponsor Blocks Guide (HotKey: 3)"
                arrow
              >
                <Typography variant="caption">sponsor blocks</Typography>
              </LightTooltip>
            </ToggleButton>
            <ToggleButton
              value={PaintingGuides.NUMBERBLOCKS}
              aria-label="number-blocks"
            >
              <LightTooltip
                title="Toggle Number Blocks Guide (HotKey: 4)"
                arrow
              >
                <Typography variant="caption">number blocks</Typography>
              </LightTooltip>
            </ToggleButton>
            <ToggleButton value={PaintingGuides.GRID} aria-label="grid">
              <LightTooltip title="Toggle Grid Guide (HotKey: 5)" arrow>
                <Typography variant="caption">grid</Typography>
              </LightTooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignContent="center">
          <Button variant="outlined" onClick={onDownloadTGA}>
            Download TGA
          </Button>
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

          <ZoomButton
            variant="contained"
            endIcon={<ArrowUpIcon />}
            onClick={handleZoomPoperOpen}
          >
            {(zoom * 100).toFixed(2)} %
          </ZoomButton>

          <ZoomPopover
            anchorEl={anchorEl}
            zoom={zoom}
            setZoom={handleZoom}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onZoomFit={onZoomFit}
            onClose={handleCloseZoomPoper}
          />
        </Box>
      </Box>
    </Wrapper>
  );
});

export default Toolbar;
