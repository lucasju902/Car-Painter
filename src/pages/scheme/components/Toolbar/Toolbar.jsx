import React, { useState, useCallback, useMemo } from "react";
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
import { CircularProgress } from "components/MaterialUI";

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

  const handleCloseDialog = useCallback(() => setDialog(null), []);

  const handleChangePaintingGuides = useCallback(
    (event, newFormats) => {
      dispatch(setPaintingGuides(newFormats));
    },
    [dispatch]
  );

  const handleApplyRace = useCallback(
    async (values = null) => {
      if (!values && primaryRaceNumber === -1) {
        console.error("Cannot Apply Race options!");
        return;
      }
      setApplyingRace(true);
      const dataURL = await retrieveTGADataURL();
      let blob = dataURItoBlob(dataURL);
      var fileOfBlob = new File([blob], `${currentScheme.id}.png`, {
        type: "image/png",
      });

      let formData = new FormData();
      formData.append("car_tga", fileOfBlob);
      formData.append("builder_id", currentScheme.id);
      if (values) {
        formData.append("night", values.night);
        formData.append("primary", values.primary);
        formData.append("num", values.num);
        formData.append("number", values.number);
        formData.append("series", values.series);
        formData.append("team", values.team);
      } else {
        formData.append("night", cars[primaryRaceNumber].night);
        formData.append("primary", cars[primaryRaceNumber].primary);
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
      }

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
    [primaryRaceNumber, retrieveTGADataURL, currentScheme.id, dispatch, cars]
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
          {!currentScheme.hide_spec && currentCarMake.car_type !== "Misc" && (
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

          {primaryRaceNumber > -1 ? (
            <CustomButtonGroup variant="outlined">
              <Button
                variant="outlined"
                color="primary"
                disabled={currentScheme.race_updated || applyingRace}
                onClick={() => handleApplyRace()}
              >
                {applyingRace ? <CircularProgress size={20} /> : "Update"}
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
              onClick={() => setDialog(DialogTypes.RACE)}
            >
              Race
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
              <Button onClick={handleOpenRaceDialog}>Open Race Settings</Button>
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
