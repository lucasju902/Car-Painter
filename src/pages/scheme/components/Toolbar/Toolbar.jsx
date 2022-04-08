import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogTypes, PaintingGuides } from "constant";

import {
  IconButton,
  Typography,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "components/MaterialUI";
import {
  Wrapper,
  ZoomButton,
  UndoIcon,
  RedoIcon,
  ArrowUpIcon,
} from "./Toolbar.style";
import { LightTooltip } from "components/common";
import { SimPreviewGuideDialog, ZoomPopover } from "components/dialogs";

import {
  setZoom,
  historyActionBack,
  historyActionUp,
  setPaintingGuides,
  // setViewMode,
} from "redux/reducers/boardReducer";
import { useZoom } from "hooks";
import { CircularProgress } from "components/MaterialUI";
import { updateScheme } from "redux/reducers/schemeReducer";
import {
  setAskingSimPreviewByLatest,
  submitSimPreview,
} from "redux/reducers/downloaderReducer";

export const Toolbar = React.memo((props) => {
  const { stageRef, retrieveTGABlobURL } = props;
  const [zoom, onZoomIn, onZoomOut, onZoomFit] = useZoom(stageRef);

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);

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
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  // const viewMode = useSelector((state) => state.boardReducer.viewMode);
  const isWindows = useMemo(
    () => window.navigator.userAgent.includes("Win"),
    []
  );
  const downloaderRunning = useSelector(
    (state) => state.downloaderReducer.iracing
  );
  const simPreviewing = useSelector(
    (state) => state.downloaderReducer.simPreviewing
  );
  const askingSimPreviewByLatest = useSelector(
    (state) => state.downloaderReducer.askingSimPreviewByLatest
  );

  const handleCloseDialog = useCallback(() => setDialog(null), []);

  const handleChangePaintingGuides = useCallback(
    (event, newFormats) => {
      dispatch(setPaintingGuides(newFormats));
    },
    [dispatch]
  );

  const applySubmitSimPreview = useCallback(
    async (isCustomNumber = 0) => {
      const fileOfBlob = await retrieveTGABlobURL(isCustomNumber);

      let formData = new FormData();
      formData.append("file1", fileOfBlob);

      dispatch(submitSimPreview(currentScheme.id, isCustomNumber, formData));
    },
    [retrieveTGABlobURL, dispatch, currentScheme]
  );

  const handleSubmitSimPreview = useCallback(
    async (isCustomNumber = 0) => {
      handleCloseDialog();
      await applySubmitSimPreview(isCustomNumber);
      dispatch(
        updateScheme(
          {
            ...currentScheme,
            last_number: isCustomNumber,
          },
          false,
          false
        )
      );
    },
    [handleCloseDialog, applySubmitSimPreview, dispatch, currentScheme]
  );

  // const handleToggleViewMode = useCallback(() => {
  //   dispatch(
  //     setViewMode(
  //       viewMode === ViewModes.NORMAL_VIEW
  //         ? ViewModes.SPEC_VIEW
  //         : ViewModes.NORMAL_VIEW
  //     )
  //   );
  // }, [dispatch, viewMode]);

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

  const handleClickSimPreview = useCallback(() => {
    setDialog(DialogTypes.SIM_PREVIEW_GUIDE);
  }, []);

  useEffect(() => {
    if (askingSimPreviewByLatest) {
      applySubmitSimPreview(currentScheme.last_number);
      dispatch(setAskingSimPreviewByLatest(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askingSimPreviewByLatest]);

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
          {/* <Button variant="outlined" onClick={handleToggleViewMode} mx={1}>
            Toggle View Mode
          </Button> */}

          <Box mr={1} height="100%" display="flex">
            <LightTooltip
              title={
                downloaderRunning
                  ? "Open Sim Preview Dialog (Or just run quick Sim Preview Action by HotKey: P)"
                  : downloaderRunning === false
                  ? "Trading Paints Downloader is running but you are not in a iRacing session"
                  : "Trading Paints Downloader is not detected"
              }
              arrow
            >
              <Button
                variant="outlined"
                disabled={!isWindows || simPreviewing}
                onClick={handleClickSimPreview}
              >
                {simPreviewing ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="subtitle2">Sim Preview</Typography>
                )}
              </Button>
            </LightTooltip>
          </Box>

          <LightTooltip title="Undo" arrow>
            <Box display="flex">
              <IconButton
                disabled={actionHistoryIndex === -1}
                mx={1}
                onClick={() => handleUndoRedo(true)}
              >
                <UndoIcon />
              </IconButton>
            </Box>
          </LightTooltip>

          <LightTooltip title="Redo" arrow>
            <Box display="flex">
              <IconButton
                disabled={actionHistoryIndex === actionHistory.length - 1}
                mx={1}
                onClick={() => handleUndoRedo(false)}
              >
                <RedoIcon />
              </IconButton>
            </Box>
          </LightTooltip>

          <ZoomButton
            variant="contained"
            endIcon={<ArrowUpIcon />}
            onClick={handleZoomPoperOpen}
          >
            <Typography variant="subtitle2">
              {(zoom * 100).toFixed(2)} %
            </Typography>
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
      <SimPreviewGuideDialog
        open={dialog === DialogTypes.SIM_PREVIEW_GUIDE}
        applying={simPreviewing}
        onApply={handleSubmitSimPreview}
        onCancel={handleCloseDialog}
      />
    </Wrapper>
  );
});

export default Toolbar;
