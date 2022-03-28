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
import { SimPreviewGuideDialog, ZoomPopover } from "components/dialogs";
import RaceIcon from "assets/race.svg";

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
import { CircularProgress } from "components/MaterialUI";
import { setMessage } from "redux/reducers/messageReducer";
import RaceConfirmDialog from "components/dialogs/RaceConfirmDialog";
import { updateScheme } from "redux/reducers/schemeReducer";
import {
  setAskingSimPreviewByLatest,
  submitSimPreview,
} from "redux/reducers/downloaderReducer";

export const Toolbar = React.memo((props) => {
  const {
    stageRef,
    onDownloadTGA,
    onDownloadSpecTGA,
    retrieveTGAPNGDataUrl,
    retrieveTGABlobURL,
  } = props;
  const [zoom, onZoomIn, onZoomOut, onZoomFit] = useZoom(stageRef);

  const [anchorEl, setAnchorEl] = useState(null);
  const [tgaAnchorEl, setTGAAnchorEl] = useState(null);
  const [raceAnchorEl, setRaceAnchorEl] = useState(null);
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
  const cars = useSelector((state) => state.carReducer.cars);
  const primaryRaceNumber = useMemo(() => {
    if (!cars) return -1;
    if (cars[0] && cars[0].primary) return 0;
    if (cars[1] && cars[1].primary) return 1;
    return -1;
  }, [cars]);
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

  const handleApplyRace = useCallback(
    async (values = null) => {
      if (!values && primaryRaceNumber === -1) {
        console.error("Cannot Apply Race options!");
        return;
      }
      setApplyingRace(true);
      const dataURL = await retrieveTGAPNGDataUrl();
      let blob = dataURItoBlob(dataURL);
      var fileOfBlob = new File([blob], `${currentScheme.id}.png`, {
        type: "image/png",
      });

      let formData = new FormData();
      formData.append("car_tga", fileOfBlob);
      formData.append("builder_id", currentScheme.id);

      let isCustomNumber = 0;
      if (values) {
        formData.append("night", values.night);
        formData.append("primary", values.primary);
        formData.append("num", values.num);
        formData.append("number", values.number);
        formData.append("series", values.series);
        formData.append("team", values.team);
        isCustomNumber = values.number;
      } else {
        formData.append("primary", cars[primaryRaceNumber].primary);
        formData.append(
          "night",
          cars[primaryRaceNumber].primary
            ? false
            : cars[primaryRaceNumber].night
        );

        formData.append("num", cars[primaryRaceNumber].num);
        formData.append("number", primaryRaceNumber);
        formData.append(
          "series",
          cars[primaryRaceNumber].leagues
            .filter((item) => item.racing)
            .map((item) => item.series_id)
        );
        formData.append(
          "team",
          cars[primaryRaceNumber].teams
            .filter((item) => item.racing)
            .map((item) => item.team_id)
        );
        isCustomNumber = primaryRaceNumber;
      }

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

      dispatch(
        setCarRace(
          formData,
          () => {
            dispatch(
              getCarRaces(
                currentScheme.id,
                () => {
                  setApplyingRace(false);
                  handleCloseDialog();
                  dispatch(
                    setMessage({
                      type: "success",
                      message: "Raced car successfully!",
                    })
                  );
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
    [
      primaryRaceNumber,
      retrieveTGAPNGDataUrl,
      currentScheme,
      dispatch,
      cars,
      handleCloseDialog,
    ]
  );

  const handleConfirmRace = useCallback(
    (dismiss) => {
      if (dismiss) {
        dispatch(
          updateScheme(
            {
              ...currentScheme,
              dismiss_race_confirm: dismiss,
            },
            false,
            false
          )
        );
      }
      handleCloseDialog();
      handleApplyRace();
    },
    [handleApplyRace, handleCloseDialog, dispatch, currentScheme]
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

  const handleOpenRaceOptions = (event) => {
    setRaceAnchorEl(event.currentTarget);
  };

  const handleRaceOptionsClose = () => {
    setRaceAnchorEl(null);
  };

  const handleOpenRaceDialog = () => {
    setDialog(DialogTypes.RACE);
    handleRaceOptionsClose();
  };

  const onRaceUpdate = useCallback(() => {
    if (currentScheme.dismiss_race_confirm) {
      handleApplyRace();
    } else {
      setDialog(DialogTypes.RACE_CONFIRM);
    }
  }, [currentScheme, handleApplyRace]);

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
          {!currentScheme.hide_spec && currentCarMake.car_type !== "Misc" && (
            <Button variant="outlined" onClick={onDownloadSpecTGA} mx={1}>
              <Typography variant="subtitle2">Download Spec TGA</Typography>
            </Button>
          )}
          <Box mr={1} height="100%" display="flex">
            <CustomButtonGroup variant="outlined">
              <Button onClick={() => onDownloadTGA()}>
                <Typography variant="subtitle2">Download TGA</Typography>
              </Button>
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

          {primaryRaceNumber > -1 ? (
            <CustomButtonGroup variant="outlined">
              <Button
                variant="outlined"
                color="primary"
                disabled={currentScheme.race_updated || applyingRace}
                startIcon={
                  <img src={RaceIcon} width={25} height={25} alt="Race" />
                }
                onClick={onRaceUpdate}
              >
                {applyingRace ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="subtitle2">Update</Typography>
                )}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                aria-controls="race-options-menu"
                aria-haspopup="true"
                size="small"
                onClick={handleOpenRaceOptions}
              >
                <DropUpIcon />
              </Button>
            </CustomButtonGroup>
          ) : (
            <Button
              variant="outlined"
              mx={1}
              startIcon={
                <img src={RaceIcon} width={25} height={25} alt="Race" />
              }
              onClick={() => setDialog(DialogTypes.RACE)}
            >
              <Typography variant="subtitle2">Race</Typography>
            </Button>
          )}

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

          <Popover
            open={Boolean(raceAnchorEl)}
            anchorEl={raceAnchorEl}
            onClose={handleRaceOptionsClose}
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
              <Button
                startIcon={
                  <img src={RaceIcon} width={25} height={25} alt="Race" />
                }
                onClick={handleOpenRaceDialog}
              >
                <Typography variant="subtitle2">Open Race Settings</Typography>
              </Button>
            </Box>
          </Popover>
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
                <Typography variant="subtitle2">
                  Download Custom Number TGA
                </Typography>
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
      <RaceConfirmDialog
        open={dialog === DialogTypes.RACE_CONFIRM}
        onCancel={handleCloseDialog}
        onConfirm={handleConfirmRace}
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
