import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogTypes, PaintingGuides } from "constant";

import {
  IconButton,
  Typography,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Popover,
} from "components/MaterialUI";
import {
  Wrapper,
  ZoomButton,
  UndoIcon,
  RedoIcon,
  ArrowUpIcon,
  DropUpIcon,
  CustomButtonGroup,
} from "./Toolbar.style";
import { LightTooltip } from "components/common";
import { ZoomPopover } from "components/dialogs";

import {
  setZoom,
  historyActionBack,
  historyActionUp,
  setPaintingGuides,
  // setViewMode,
} from "redux/reducers/boardReducer";
import { useZoom } from "hooks";
import RaceDialog from "components/dialogs/RaceDialog/RaceDialog";
import { getCarRaces, setCarRace } from "redux/reducers/carReducer";
import { dataURItoBlob } from "helper";

export const Toolbar = React.memo((props) => {
  const {
    stageRef,
    onDownloadTGA,
    onDownloadSpecTGA,
    retrieveTGADataURL,
  } = props;
  const [zoom, onZoomIn, onZoomOut, onZoomFit] = useZoom(stageRef);

  const [anchorEl, setAnchorEl] = useState(null);
  const [tgaAnchorEl, setTGAAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [applyingRace, setApplyingRace] = useState(false);

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
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  // const viewMode = useSelector((state) => state.boardReducer.viewMode);

  const handleCloseDialog = useCallback(() => setDialog(null), []);

  const handleChangePaintingGuides = useCallback(
    (event, newFormats) => {
      dispatch(setPaintingGuides(newFormats));
    },
    [dispatch]
  );

  const handleApplyRace = useCallback(
    async (values) => {
      setApplyingRace(true);
      const dataURL = await retrieveTGADataURL();
      let blob = dataURItoBlob(dataURL);
      var fileOfBlob = new File([blob], `${currentScheme.id}.png`, {
        type: "image/png",
      });

      let formData = new FormData();
      formData.append("car_tga", fileOfBlob);
      formData.append("builder_id", currentScheme.id);
      formData.append("night", values.night);
      formData.append("primary", values.primary);
      formData.append("num", values.num);
      formData.append("number", values.number);
      formData.append("series", values.series);
      formData.append("team", values.team);

      dispatch(
        setCarRace(
          formData,
          () => {
            dispatch(
              getCarRaces(
                currentScheme.id,
                () => {
                  setApplyingRace(false);
                },
                () => {
                  setApplyingRace(false);
                }
              )
            );
          },
          () => {
            setApplyingRace(false);
          }
        )
      );
    },
    [retrieveTGADataURL, dispatch, currentScheme.id]
  );

  const handleOpenTGAOptions = (event) => {
    setTGAAnchorEl(event.currentTarget);
  };

  const handleTGAOptionsClose = () => {
    setTGAAnchorEl(null);
  };

  const handleDownloadCustomNumberTGA = () => {
    onDownloadTGA(true);
    handleTGAOptionsClose();
  };

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
          {currentCarMake.car_type !== "Misc" && (
            <Button variant="outlined" onClick={onDownloadSpecTGA} mx={1}>
              Download Spec TGA
            </Button>
          )}
          <Box mx={1} height="100%">
            <CustomButtonGroup variant="outlined">
              <Button onClick={() => onDownloadTGA()}>Download TGA</Button>
              <Button
                aria-controls="tga-options-menu"
                aria-haspopup="true"
                size="small"
                onClick={handleOpenTGAOptions}
              >
                <DropUpIcon />
              </Button>
            </CustomButtonGroup>
          </Box>

          <Button
            variant="outlined"
            mx={1}
            onClick={() => setDialog(DialogTypes.RACE)}
          >
            Race
          </Button>

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

          <Popover
            open={Boolean(tgaAnchorEl)}
            anchorEl={tgaAnchorEl}
            onClose={handleTGAOptionsClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Box py={1}>
              <Button onClick={handleDownloadCustomNumberTGA}>
                Download Custom Number TGA
              </Button>
            </Box>
          </Popover>
        </Box>
      </Box>
      <RaceDialog
        open={dialog === DialogTypes.RACE}
        applying={applyingRace}
        onCancel={handleCloseDialog}
        onApply={handleApplyRace}
      />
    </Wrapper>
  );
});

export default Toolbar;
