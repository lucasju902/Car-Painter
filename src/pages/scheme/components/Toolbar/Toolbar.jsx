import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogTypes } from "constant";

import {
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
  Slider,
} from "components/MaterialUI";
import { Wrapper, ZoomButton } from "./Toolbar.style";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";
import { LightTooltip } from "components/common";
import {
  ShortCutsDialog,
  SimPreviewGuideDialog,
  ZoomPopover,
} from "components/dialogs";
import ShortcutIcon from "assets/keyboard-shortcuts.svg";

import {
  setZoom,
  historyActionBack,
  historyActionUp,
  setShowLayers,
  setShowProperties,
  // setViewMode,
} from "redux/reducers/boardReducer";
import { useZoom } from "hooks";
import { updateScheme } from "redux/reducers/schemeReducer";
import {
  setAskingSimPreviewByLatest,
  submitSimPreview,
} from "redux/reducers/downloaderReducer";
import { Rotate90DegreesCcw, Search as SearchIcon } from "@material-ui/icons";
import { focusBoardQuickly } from "helper";

export const Toolbar = React.memo((props) => {
  const { stageRef, retrieveTGABlobURL, onChangeBoardRotation } = props;
  const [zoom, onZoomIn, onZoomOut, onZoomFit] = useZoom(stageRef);

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);

  const dispatch = useDispatch();
  const actionHistoryIndex = useSelector(
    (state) => state.boardReducer.actionHistoryIndex
  );
  const actionHistoryMoving = useSelector(
    (state) => state.boardReducer.actionHistoryMoving
  );
  const actionHistory = useSelector(
    (state) => state.boardReducer.actionHistory
  );
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const showLayers = useSelector((state) => state.boardReducer.showLayers);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const showProperties = useSelector(
    (state) => state.boardReducer.showProperties
  );
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

  const handleCloseDialog = useCallback(() => {
    setDialog(null);
    focusBoardQuickly();
  }, []);

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
      focusBoardQuickly();
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
      focusBoardQuickly();
    },
    [dispatch]
  );

  const handleChangeBoardRotation = useCallback(
    (isRight = true) => {
      let newBoardRotate;
      if (isRight) {
        newBoardRotate = boardRotate + 90;
        if (newBoardRotate >= 360) newBoardRotate = 0;
      } else {
        newBoardRotate = boardRotate - 90;
        if (newBoardRotate < 0) newBoardRotate = 270;
      }
      onChangeBoardRotation(newBoardRotate);
      focusBoardQuickly();
    },
    [boardRotate, onChangeBoardRotation]
  );

  const handleZoomPoperOpen = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleCloseZoomPoper = useCallback(() => {
    setAnchorEl(null);
    focusBoardQuickly();
  }, [setAnchorEl]);

  const handleZoom = useCallback(
    (value) => {
      dispatch(setZoom(value));
      focusBoardQuickly();
    },
    [dispatch]
  );

  const handleZoomToFit = () => {
    onZoomFit();
    focusBoardQuickly();
  };

  const handleToggleLayers = useCallback(() => {
    dispatch(setShowLayers(!showLayers));
    focusBoardQuickly();
  }, [dispatch, showLayers]);

  const handleToggleProperties = useCallback(() => {
    dispatch(setShowProperties(!showProperties));
    focusBoardQuickly();
  }, [dispatch, showProperties]);

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
        <Box display="flex" alignContent="center">
          <LightTooltip title="Toggle Layers" arrow>
            <IconButton onClick={handleToggleLayers}>
              {showLayers ? <ChevronsLeft /> : <ChevronsRight />}
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Shortcuts" arrow>
            <IconButton onClick={() => setDialog(DialogTypes.SHORTCUTS)}>
              <img src={ShortcutIcon} width="20px" alt="shortcuts" />
            </IconButton>
          </LightTooltip>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignContent="center">
          {/* <Button variant="outlined" onClick={handleToggleViewMode} mx={1}>
            Toggle View Mode
          </Button> */}

          <LightTooltip title="Undo" arrow>
            <Box display="flex">
              <IconButton
                disabled={actionHistoryIndex === -1 || actionHistoryMoving}
                size="small"
                mx={1}
                onClick={() => handleUndoRedo(true)}
              >
                <FontAwesomeIcon icon={faUndo} size="sm" />
              </IconButton>
            </Box>
          </LightTooltip>

          <LightTooltip title="Redo" arrow>
            <Box display="flex">
              <IconButton
                disabled={
                  actionHistoryIndex === actionHistory.length - 1 ||
                  actionHistoryMoving
                }
                size="small"
                mx={1}
                onClick={() => handleUndoRedo(false)}
              >
                <FontAwesomeIcon icon={faRedo} size="sm" />
              </IconButton>
            </Box>
          </LightTooltip>

          <Box mx={4} height="100%" display="flex">
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
                variant="default"
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

          <Box display="flex" alignItems="center">
            <LightTooltip title="Zoom to fit" position="bottom" arrow>
              <IconButton onClick={handleZoomToFit} size="small">
                <SearchIcon />
              </IconButton>
            </LightTooltip>
            <Box width="80px" ml={2}>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={zoom}
                onChange={(event, value) => handleZoom(value)}
                aria-labelledby="zoom"
              />
            </Box>
            <ZoomButton variant="default" onClick={handleZoomPoperOpen}>
              <Typography variant="subtitle2">
                {(zoom * 100).toFixed(2)} %
              </Typography>
            </ZoomButton>
          </Box>
        </Box>
        <Box display="flex" alignContent="center" justifyContent="flex-end">
          <LightTooltip title="Rotate View" position="bottom" arrow>
            <IconButton onClick={() => handleChangeBoardRotation(false)}>
              <Rotate90DegreesCcw />
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Toggle Properties" arrow>
            <IconButton onClick={handleToggleProperties}>
              {showProperties ? <ChevronsRight /> : <ChevronsLeft />}
            </IconButton>
          </LightTooltip>
        </Box>
      </Box>
      <ZoomPopover
        anchorEl={anchorEl}
        zoom={zoom}
        setZoom={handleZoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomFit={onZoomFit}
        onClose={handleCloseZoomPoper}
      />
      <ShortCutsDialog
        open={dialog === DialogTypes.SHORTCUTS}
        onCancel={handleCloseDialog}
      />
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
