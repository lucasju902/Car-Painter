import React from "react";
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
  createLayerFromShape,
  createLayerFromLogo,
  createLayerFromUpload,
  createTextLayer,
} from "redux/reducers/layerReducer";

import { DialogTypes, MouseModes } from "constant";

import BasePaintDialog from "dialogs/BasePaintDialog";
import ShapeDialog from "dialogs/ShapeDialog";
import LogoDialog from "dialogs/LogoDialog";
import UploadDialog from "dialogs/UploadDialog";
import TextDialog from "dialogs/TextDialog";
import LightTooltip from "components/LightTooltip";

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

const DrawerBar = ({ dialog, setDialog, focusBoard }) => {
  const dispatch = useDispatch();
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const uploadList = useSelector((state) => state.uploadReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const basePaints = useSelector((state) => state.basePaintReducer.list);

  const handleModeChange = (value) => {
    dispatch(setMouseMode(value));
    if (value !== MouseModes.DEFAULT) {
      dispatch(setCurrentLayer(null));
    }
  };

  const handleOpenBase = (base) => {
    dispatch(createLayersFromBasePaint(currentScheme.id, base));
    setDialog(null);
    focusBoard();
  };
  const handleOpenShape = (shape) => {
    dispatch(createLayerFromShape(currentScheme.id, shape, frameSize));
    setDialog(null);
    focusBoard();
  };
  const handleOpenLogo = (logo) => {
    dispatch(createLayerFromLogo(currentScheme.id, logo, frameSize));
    setDialog(null);
    focusBoard();
  };
  const handleOpenUpload = (upload) => {
    dispatch(createLayerFromUpload(currentScheme.id, upload, frameSize));
    setDialog(null);
    focusBoard();
  };
  const handleCreateText = (values) => {
    dispatch(createTextLayer(currentScheme.id, values, frameSize));
    setDialog(null);
    focusBoard();
  };

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
              onClick={() => setDialog(item.value)}
            >
              {item.icon}
            </CustomItem>
          </LightTooltip>
        ))}
      </ToolWrapper>

      <BasePaintDialog
        open={dialog === DialogTypes.BASEPAINT}
        basePaints={basePaints}
        onOpenBase={handleOpenBase}
        onCancel={() => setDialog(null)}
      />
      <ShapeDialog
        open={dialog === DialogTypes.SHAPE}
        shapes={overlayList}
        onOpenShape={handleOpenShape}
        onCancel={() => setDialog(null)}
      />
      <LogoDialog
        open={dialog === DialogTypes.LOGO}
        logos={logoList}
        onOpenLogo={handleOpenLogo}
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
        onCreate={handleCreateText}
        onCancel={() => setDialog(null)}
      />
    </Wrapper>
  );
};

export default DrawerBar;
