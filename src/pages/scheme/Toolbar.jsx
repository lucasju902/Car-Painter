import React from "react";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { setZoom, setMouseMode } from "redux/reducers/boardReducer";
import { setCurrent as setCurrentLayer } from "redux/reducers/layerReducer";

import { spacing } from "@material-ui/system";
import {
  Button as MuiButton,
  IconButton as MuiIconButton,
  Typography as MuiTypography,
  Box,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Octagon as OctagonIcon,
} from "react-feather";
import {
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
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
} from "@fortawesome/free-solid-svg-icons";
import { faCuttlefish } from "@fortawesome/free-brands-svg-icons";
import { PaintingGuides, MouseModes } from "constant";

const Typography = styled(MuiTypography)(spacing);
const ToggleButton = styled(MuiToggleButton)(spacing);
const Button = styled(MuiButton)(spacing);
const IconButton = styled(MuiIconButton)(spacing);
const CustomSelect = styled(Select)`
  .MuiSelect-select {
    padding-left: 10px;
  }
  margin: 0 10px;
`;

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
const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;

const modes = [
  {
    value: MouseModes.DEFAULT,
    icon: <CustomFontAwesomeIcon icon={faMousePointer} />,
  },
  {
    value: MouseModes.RECT,
    icon: <CustomFontAwesomeIcon icon={faSquare} />,
  },
  {
    value: MouseModes.CIRCLE,
    icon: <CustomFontAwesomeIcon icon={faCircle} />,
  },
  {
    value: MouseModes.ELLIPSE,
    icon: <CustomFontAwesomeIcon icon={faCircle} isstretch="true" />,
  },
  {
    value: MouseModes.STAR,
    icon: <CustomFontAwesomeIcon icon={faStar} />,
  },
  {
    value: MouseModes.RING,
    icon: <CustomFontAwesomeIcon icon={faDotCircle} />,
  },
  {
    value: MouseModes.REGULARPOLYGON,
    icon: <OctagonIcon size={17} />,
  },
  {
    value: MouseModes.WEDGE,
    icon: <WedgeIcon fontSize="small" />,
  },
  {
    value: MouseModes.ARC,
    icon: <CustomFontAwesomeIcon icon={faCuttlefish} />,
  },
  {
    value: MouseModes.POLYGON,
    icon: <CustomFontAwesomeIcon icon={faDrawPolygon} />,
  },
  {
    value: MouseModes.LINE,
    icon: <LineIcon />,
  },
  {
    value: MouseModes.ARROW,
    icon: <ArrowIcon fontSize="small" />,
  },
];

const Toolbar = (props) => {
  const {
    onZoomIn,
    onZoomOut,
    onChangePaintingGuides,
    onChangeBoardRotation,
  } = props;

  const dispatch = useDispatch();
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );
  const zoom = useSelector((state) => state.boardReducer.zoom);
  const boardRotate = useSelector((state) => state.boardReducer.boardRotate);
  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);

  const handleChangePaintingGuides = (event, newFormats) => {
    onChangePaintingGuides(newFormats);
  };

  const handleZoomChange = (event) => {
    dispatch(setZoom(parseInt(event.target.value || 0) / 100.0));
  };
  const handleChangeBoardRotation = (isRight = true) => {
    let newBoardRotate;
    if (isRight) {
      newBoardRotate = boardRotate + 90;
      if (newBoardRotate >= 360) newBoardRotate = 0;
    } else {
      newBoardRotate = boardRotate - 90;
      if (newBoardRotate < 0) newBoardRotate = 270;
    }
    onChangeBoardRotation(newBoardRotate);
  };
  const handleModeChange = (event) => {
    dispatch(setMouseMode(event.target.value));
    if (event.target.value !== MouseModes.DEFAULT) {
      dispatch(setCurrentLayer(null));
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
          <Typography variant="subtitle1" mr={2}>
            Painting Guides:
          </Typography>
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
          <CustomSelect
            value={mouseMode}
            onChange={handleModeChange}
            renderValue={(value) => {
              const mode = modes.find((item) => item.value === value);
              if (!mode) {
                return <></>;
              }
              return mode.icon;
            }}
          >
            {modes.map((mode) => (
              <MenuItem value={mode.value} key={mode.value}>
                {mode.icon}
              </MenuItem>
            ))}
          </CustomSelect>
          <Button mr={2} variant="outlined">
            SHORTCUTS
          </Button>
          <Button mr={2} variant="outlined">
            SIM PREVIEW
          </Button>
          <IconButton onClick={() => handleChangeBoardRotation(false)}>
            <RotateLeftIcon />
          </IconButton>
          <IconButton onClick={() => handleChangeBoardRotation(true)}>
            <RotateRightIcon />
          </IconButton>
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
