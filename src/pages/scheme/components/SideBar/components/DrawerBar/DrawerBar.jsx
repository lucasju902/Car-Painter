import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { HorizontalDivider, IconButton } from "components/MaterialUI";
import { Octagon as OctagonIcon } from "react-feather";
import {
  SignalWifi4Bar as WedgeIcon,
  ShowChart as LineIcon,
  TrendingUp as ArrowIcon,
} from "@material-ui/icons";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import {
  faSquare,
  faCircle,
  faStar,
  faDotCircle,
  faMousePointer,
  faDrawPolygon,
  faPaintBrush,
  faFont,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faCuttlefish } from "@fortawesome/free-brands-svg-icons";
import BasepaintIcon from "assets/base-paint.svg";
import GraphicsIcon from "assets/insert-graphics.svg";
import LogoIcon from "assets/insert-logo.svg";

import { setMouseMode, setShowLayers } from "redux/reducers/boardReducer";
import {
  setCurrent as setCurrentLayer,
  createLayersFromBasePaint,
  createLayerFromOverlay,
  createLayerFromLogo,
  createLayerFromUpload,
  createTextLayer,
  updateLayer,
} from "redux/reducers/layerReducer";
import { updateScheme } from "redux/reducers/schemeReducer";

import { getZoomedCenterPosition, focusBoard } from "helper";
import { DialogTypes, MouseModes } from "constant";
import { EnglishLang } from "constant/language";

import {
  BasePaintDialog,
  OverlayDialog,
  LogoDialog,
  UploadDialog,
  TextDialog,
  DefaultSettingsDialog,
} from "components/dialogs";
import { LightTooltip } from "components/common";
import {
  Wrapper,
  ToolWrapper,
  CustomItem,
  CustomFontAwesomeIcon,
} from "./DrawerBar.style";
import { DefaultSettingsButton } from "./DefaultSettingsButton";
import { CustomDrawingItem } from "./DrawerBar.style";

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
    label: EnglishLang.INSERT_MY_LOGO,
    icon: (
      <CustomFontAwesomeIcon style={{ height: "30px" }} icon={faFolderOpen} />
    ),
  },
  {
    value: DialogTypes.LOGO,
    label: EnglishLang.INSERT_LOGO,
    icon: <img src={LogoIcon} alt="Logos" height="30px" />,
  },
  {
    value: DialogTypes.TEXT,
    label: EnglishLang.INSERT_TEXT,
    icon: <CustomFontAwesomeIcon style={{ height: "30px" }} icon={faFont} />,
  },
  {
    value: DialogTypes.SHAPE,
    label: EnglishLang.INSERT_GRAPHICS,
    icon: <img src={GraphicsIcon} alt="Graphics" height="30px" />,
  },
  {
    value: DialogTypes.BASEPAINT,
    label: EnglishLang.INSERT_BASEPAINT,
    icon: <img src={BasepaintIcon} alt="BasePaint" height="30px" />,
  },
];

export const DrawerBar = React.memo(
  ({ dialog, setDialog, stageRef, editable }) => {
    const dispatch = useDispatch();
    const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
    const showLayers = useSelector((state) => state.boardReducer.showLayers);
    const currentScheme = useSelector((state) => state.schemeReducer.current);
    const currentCarMake = useSelector((state) => state.carMakeReducer.current);
    const currentLayer = useSelector((state) => state.layerReducer.current);
    const overlayList = useSelector((state) => state.overlayReducer.list);
    const logoList = useSelector((state) => state.logoReducer.list);
    const uploadList = useSelector((state) => state.uploadReducer.list);
    const fontList = useSelector((state) => state.fontReducer.list);
    const frameSize = useSelector((state) => state.boardReducer.frameSize);
    const zoom = useSelector((state) => state.boardReducer.zoom);
    const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
    const basePaints = useSelector((state) => state.basePaintReducer.list);
    const user = useSelector((state) => state.authReducer.user);

    const hideDialog = useCallback(() => setDialog(null), [setDialog]);

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
      [dispatch, setDialog, currentScheme.id, currentScheme.legacy_mode]
    );
    const handleOpenOverlay = useCallback(
      (shape) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromOverlay(
            currentScheme.id,
            shape,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        setDialog(null);
        focusBoard();
      },
      [
        dispatch,
        currentScheme.id,
        stageRef,
        frameSize,
        zoom,
        boardRotate,
        setDialog,
      ]
    );
    const handleOpenLogo = useCallback(
      (logo) => {
        dispatch(setMouseMode(MouseModes.DEFAULT));
        dispatch(
          createLayerFromLogo(
            currentScheme.id,
            logo,
            getZoomedCenterPosition(stageRef, frameSize, zoom, boardRotate)
          )
        );
        setDialog(null);
        focusBoard();
      },
      [
        dispatch,
        currentScheme.id,
        stageRef,
        frameSize,
        zoom,
        boardRotate,
        setDialog,
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
      [dispatch, setDialog, currentScheme.id, stageRef, frameSize, zoom]
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
      [dispatch, setDialog, currentScheme.id, stageRef, frameSize, zoom]
    );

    const handleApplySettings = useCallback(
      (guide_data) => {
        if (currentLayer) {
          dispatch(
            updateLayer({
              id: currentLayer.id,
              layer_data: {
                ...currentLayer.layer_data,
                color: guide_data.default_shape_color,
                opacity: guide_data.default_shape_opacity,
                scolor: guide_data.default_shape_scolor,
                stroke: guide_data.default_shape_stroke,
              },
            })
          );
        } else {
          dispatch(
            updateScheme({
              ...currentScheme,
              guide_data: guide_data,
            })
          );
        }
        setDialog(null);
      },
      [dispatch, currentScheme, currentLayer, setDialog]
    );

    const handleToggleLayers = useCallback(() => {
      dispatch(setShowLayers(!showLayers));
    }, [dispatch, showLayers]);

    return (
      <Wrapper
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToolWrapper>
          {modes.map((mode) => (
            <LightTooltip
              key={mode.value}
              title={mode.label}
              arrow
              placement="right"
            >
              <CustomDrawingItem
                value={mode.value}
                disabled={!editable}
                onClick={() => handleModeChange(mode.value)}
                active={mode.value === mouseMode ? "true" : "false"}
              >
                {mode.icon}
              </CustomDrawingItem>
            </LightTooltip>
          ))}
          <HorizontalDivider my={1} />
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
          <HorizontalDivider my={1} />
          <DefaultSettingsButton
            onClick={() =>
              editable ? setDialog(DialogTypes.DEFAULT_SHAPE_SETTINGS) : null
            }
          />
        </ToolWrapper>
        <LightTooltip title="Toggle Layers" arrow>
          <IconButton onClick={handleToggleLayers}>
            {showLayers ? <ChevronsLeft /> : <ChevronsRight />}
          </IconButton>
        </LightTooltip>

        <BasePaintDialog
          open={dialog === DialogTypes.BASEPAINT}
          legacyMode={currentScheme.legacy_mode}
          carMake={currentCarMake}
          basePaints={basePaints}
          onOpenBase={handleOpenBase}
          onCancel={hideDialog}
        />
        <OverlayDialog
          open={dialog === DialogTypes.SHAPE}
          overlays={overlayList}
          onOpenOverlay={handleOpenOverlay}
          onCancel={hideDialog}
        />
        <LogoDialog
          open={dialog === DialogTypes.LOGO}
          logos={logoList}
          uploads={uploadList}
          user={user}
          onOpenLogo={handleOpenLogo}
          onOpenUpload={handleOpenUpload}
          onCancel={hideDialog}
        />
        <UploadDialog
          open={dialog === DialogTypes.UPLOAD}
          uploads={uploadList}
          onOpenUpload={handleOpenUpload}
          onCancel={hideDialog}
        />
        <TextDialog
          open={dialog === DialogTypes.TEXT}
          fontList={fontList}
          baseColor={currentScheme.base_color}
          defaultColor={currentScheme.guide_data.default_shape_color}
          defaultStrokeColor={currentScheme.guide_data.default_shape_scolor}
          onCreate={handleCreateText}
          onCancel={hideDialog}
        />
        <DefaultSettingsDialog
          open={dialog === DialogTypes.DEFAULT_SHAPE_SETTINGS}
          onApply={handleApplySettings}
          onCancel={hideDialog}
        />
      </Wrapper>
    );
  }
);

export default DrawerBar;
