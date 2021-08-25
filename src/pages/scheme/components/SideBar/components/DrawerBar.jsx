import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import { Box, MenuItem, Divider as MuiDivider } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Octagon as OctagonIcon } from "react-feather";
import {
  SignalWifi4Bar as WedgeIcon,
  ShowChart as LineIcon,
  TrendingUp as ArrowIcon,
} from "@material-ui/icons";
import {
  faSquare,
  faCircle,
  faStar,
  faDotCircle,
  faMousePointer,
  faDrawPolygon,
  faPaintBrush,
  faImage,
  faFont,
  faFolderOpen,
  faShapes,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import { faCuttlefish } from "@fortawesome/free-brands-svg-icons";

import { setMouseMode } from "redux/reducers/boardReducer";
import {
  setCurrent as setCurrentLayer,
  createLayersFromBasePaint,
  createLayerFromOverlay,
  createLayerFromLogo,
  createLayerFromUpload,
  createTextLayer,
} from "redux/reducers/layerReducer";
import { updateScheme } from "redux/reducers/schemeReducer";

import { alphaToHex, getZoomedCenterPosition } from "helper";
import { DialogTypes, MouseModes } from "constant";

import {
  BasePaintDialog,
  OverlayDialog,
  LogoDialog,
  UploadDialog,
  TextDialog,
  DefaultSettingsDialog,
} from "components/dialogs";
import { LightTooltip } from "components/common";

const Divider = styled(MuiDivider)(spacing);
const Wrapper = styled(Box)`
  background: #666666;
  padding: 0px 10px 0 15px;
`;
const ToolWrapper = styled(Box)`
  background: #444;
  border-radius: 5px;
  padding: 5px 1px;
`;
const CustomItem = styled(MenuItem)`
  display: flex;
  justify-content: center;
  padding: 7px 10px;
  background-color: ${(props) =>
    props.active === "true" ? "rgba(255, 255, 255, 0.08)" : "none"};
`;

const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;

const DefaultSettingsButton = styled(Box)`
  outline: ${(props) => props.outline};
  cursor: pointer;
`;

const modes = [
  {
    value: MouseModes.DEFAULT,
    label: "Default Mode",
    icon: <CustomFontAwesomeIcon icon={faMousePointer} />,
  },
  {
    value: MouseModes.POLYGON,
    label: "Polygon Mode",
    icon: <CustomFontAwesomeIcon icon={faDrawPolygon} />,
  },
  {
    value: MouseModes.LINE,
    label: "Line Mode",
    icon: <LineIcon />,
  },
  {
    value: MouseModes.PEN,
    label: "Brush Mode",
    icon: <CustomFontAwesomeIcon icon={faPaintBrush} />,
  },
  {
    value: MouseModes.RECT,
    label: "Rectangle Mode",
    icon: <CustomFontAwesomeIcon icon={faSquare} />,
  },
  {
    value: MouseModes.CIRCLE,
    label: "Circle Mode",
    icon: <CustomFontAwesomeIcon icon={faCircle} />,
  },
  {
    value: MouseModes.ELLIPSE,
    label: "Ellipse Mode",
    icon: <CustomFontAwesomeIcon icon={faCircle} isstretch="true" />,
  },
  {
    value: MouseModes.STAR,
    label: "Star Mode",
    icon: <CustomFontAwesomeIcon icon={faStar} />,
  },
  {
    value: MouseModes.RING,
    label: "Ring Mode",
    icon: <CustomFontAwesomeIcon icon={faDotCircle} />,
  },
  {
    value: MouseModes.REGULARPOLYGON,
    label: "Regular Polygon Mode",
    icon: <OctagonIcon size={17} />,
  },
  {
    value: MouseModes.WEDGE,
    label: "Wedge Mode",
    icon: <WedgeIcon fontSize="small" />,
  },
  {
    value: MouseModes.ARC,
    label: "Arc Mode",
    icon: <CustomFontAwesomeIcon icon={faCuttlefish} />,
  },
  {
    value: MouseModes.ARROW,
    label: "Arrow Mode",
    icon: <ArrowIcon fontSize="small" />,
  },
];

const dialog_modes = [
  {
    value: DialogTypes.UPLOAD,
    label: "Insert My Logo/Upload New Logo",
    icon: <CustomFontAwesomeIcon icon={faFolderOpen} />,
  },
  {
    value: DialogTypes.LOGO,
    label: "Insert Logo",
    icon: <CustomFontAwesomeIcon icon={faImage} />,
  },
  {
    value: DialogTypes.TEXT,
    label: "Insert Text",
    icon: <CustomFontAwesomeIcon icon={faFont} />,
  },
  {
    value: DialogTypes.SHAPE,
    label: "Insert Overlay",
    icon: <CustomFontAwesomeIcon icon={faShapes} />,
  },
  {
    value: DialogTypes.BASEPAINT,
    label: "Insert BasePaint",
    icon: <CustomFontAwesomeIcon icon={faCar} />,
  },
];

export const DrawerBar = React.memo(
  ({ dialog, setDialog, focusBoard, stageRef, editable }) => {
    const dispatch = useDispatch();
    const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
    const currentScheme = useSelector((state) => state.schemeReducer.current);
    const currentCarMake = useSelector((state) => state.carMakeReducer.current);
    const overlayList = useSelector((state) => state.overlayReducer.list);
    const logoList = useSelector((state) => state.logoReducer.list);
    const uploadList = useSelector((state) => state.uploadReducer.list);
    const fontList = useSelector((state) => state.fontReducer.list);
    const frameSize = useSelector((state) => state.boardReducer.frameSize);
    const zoom = useSelector((state) => state.boardReducer.zoom);
    const basePaints = useSelector((state) => state.basePaintReducer.list);
    const user = useSelector((state) => state.authReducer.user);

    const handleModeChange = useCallback(
      (value) => {
        dispatch(setMouseMode(value));
        if (value !== MouseModes.DEFAULT) {
          dispatch(setCurrentLayer(null));
        }
      },
      [dispatch]
    );

    const handleOpenBase = useCallback(
      (basePaintItemORIndex) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayersFromBasePaint(
            currentScheme.id,
            basePaintItemORIndex,
            currentScheme.legacy_mode
          )
        );
        setDialog(null);
        focusBoard();
      },
      [dispatch, setDialog, focusBoard, currentScheme && currentScheme.id]
    );
    const handleOpenOverlay = useCallback(
      (shape) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromOverlay(
            currentScheme.id,
            shape,
            getZoomedCenterPosition(stageRef, frameSize, zoom)
          )
        );
        setDialog(null);
        focusBoard();
      },
      [
        dispatch,
        setDialog,
        focusBoard,
        currentScheme && currentScheme.id,
        getZoomedCenterPosition,
        stageRef,
        frameSize,
        zoom,
      ]
    );
    const handleOpenLogo = useCallback(
      (logo) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromLogo(
            currentScheme.id,
            logo,
            getZoomedCenterPosition(stageRef, frameSize, zoom)
          )
        );
        setDialog(null);
        focusBoard();
      },
      [
        dispatch,
        setDialog,
        focusBoard,
        currentScheme && currentScheme.id,
        getZoomedCenterPosition,
        stageRef,
        frameSize,
        zoom,
      ]
    );
    const handleOpenUpload = useCallback(
      (upload) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromUpload(
            currentScheme.id,
            upload,
            getZoomedCenterPosition(stageRef, frameSize, zoom)
          )
        );
        setDialog(null);
        focusBoard();
      },
      [
        dispatch,
        setDialog,
        focusBoard,
        currentScheme && currentScheme.id,
        getZoomedCenterPosition,
        stageRef,
        frameSize,
        zoom,
      ]
    );
    const handleCreateText = useCallback(
      (values) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        console.log(getZoomedCenterPosition(stageRef, frameSize, zoom));
        dispatch(
          createTextLayer(
            currentScheme.id,
            values,
            getZoomedCenterPosition(stageRef, frameSize, zoom)
          )
        );
        setDialog(null);
        focusBoard();
      },
      [
        dispatch,
        setDialog,
        focusBoard,
        currentScheme && currentScheme.id,
        getZoomedCenterPosition,
        stageRef,
        frameSize,
        zoom,
      ]
    );

    const handleApplySettings = useCallback(
      (guide_data) => {
        dispatch(
          updateScheme({
            ...currentScheme,
            guide_data: guide_data,
          })
        );
        setDialog(null);
      },
      [dispatch, currentScheme, setDialog]
    );

    return (
      <Wrapper>
        <ToolWrapper>
          {modes.map((mode) => (
            <LightTooltip
              key={mode.value}
              title={mode.label}
              arrow
              placement="right"
            >
              <CustomItem
                value={mode.value}
                disabled={!editable}
                onClick={() => handleModeChange(mode.value)}
                active={mode.value === mouseMode ? "true" : "false"}
              >
                {mode.icon}
              </CustomItem>
            </LightTooltip>
          ))}
          <Divider my={1} />
          {dialog_modes.map((item) => (
            <LightTooltip
              key={item.value}
              title={item.label}
              arrow
              placement="right"
            >
              <CustomItem
                value={item.value}
                disabled={!editable}
                onClick={() => setDialog(item.value)}
              >
                {item.icon}
              </CustomItem>
            </LightTooltip>
          ))}
          <Divider my={1} />
          <Box
            display="flex"
            justifyContent="center"
            width="45px"
            height="45px"
            alignItems="center"
          >
            <LightTooltip
              title="Default Shape Settings"
              arrow
              placement="right"
            >
              <Box bgcolor="#FFFFFF" height="25px">
                <DefaultSettingsButton
                  width="25px"
                  height="25px"
                  bgcolor={
                    (currentScheme.guide_data.default_shape_color ||
                      "#000000") +
                    alphaToHex(
                      currentScheme.guide_data.default_shape_opacity || 1
                    )
                  }
                  outline={`${
                    currentScheme.guide_data.default_shape_stroke || 0
                  }px solid ${
                    currentScheme.guide_data.default_shape_scolor || "#000000"
                  }`}
                  onClick={() =>
                    editable
                      ? setDialog(DialogTypes.DEFAULT_SHAPE_SETTINGS)
                      : null
                  }
                />
              </Box>
            </LightTooltip>
          </Box>
        </ToolWrapper>

        <BasePaintDialog
          open={dialog === DialogTypes.BASEPAINT}
          legacyMode={currentScheme.legacy_mode}
          carMake={currentCarMake}
          basePaints={basePaints}
          onOpenBase={handleOpenBase}
          onCancel={() => setDialog(null)}
        />
        <OverlayDialog
          open={dialog === DialogTypes.SHAPE}
          overlays={overlayList}
          onOpenOverlay={handleOpenOverlay}
          onCancel={() => setDialog(null)}
        />
        <LogoDialog
          open={dialog === DialogTypes.LOGO}
          logos={logoList}
          uploads={uploadList}
          user={user}
          onOpenLogo={handleOpenLogo}
          onOpenUpload={handleOpenUpload}
          onCancel={() => setDialog(null)}
        />
        <UploadDialog
          open={dialog === DialogTypes.UPLOAD}
          uploads={uploadList}
          onOpenUpload={handleOpenUpload}
          onCancel={() => setDialog(null)}
        />
        <TextDialog
          open={dialog === DialogTypes.TEXT}
          fontList={fontList}
          baseColor={currentScheme.base_color}
          defaultColor={currentScheme.guide_data.default_shape_color}
          defaultStrokeColor={currentScheme.guide_data.default_shape_scolor}
          onCreate={handleCreateText}
          onCancel={() => setDialog(null)}
        />
        <DefaultSettingsDialog
          open={dialog === DialogTypes.DEFAULT_SHAPE_SETTINGS}
          onApply={handleApplySettings}
          onCancel={() => setDialog(null)}
        />
      </Wrapper>
    );
  }
);

export default DrawerBar;
