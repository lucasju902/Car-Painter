import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { DialogTypes, LayerTypes } from "constant";

import { Box, Button } from "@material-ui/core";

import {
  faImage,
  faFont,
  faFolderOpen,
  faShapes,
  faCar,
} from "@fortawesome/free-solid-svg-icons";

import TitleBar from "./TitleBar";
import PartGroup from "./PartGroup";

import { changeBaseColor } from "redux/reducers/schemeReducer";
import {
  createLayersFromBasePaint,
  createLayerFromShape,
  createLayerFromLogo,
  createLayerFromUpload,
  createTextLayer,
} from "redux/reducers/layerReducer";

import BasePaintDialog from "dialogs/BasePaintDialog";
import ShapeDialog from "dialogs/ShapeDialog";
import LogoDialog from "dialogs/LogoDialog";
import UploadDialog from "dialogs/UploadDialog";
import TextDialog from "dialogs/TextDialog";
import ColorPickerInput from "components/ColorPickerInput";

const Wrapper = styled(Box)`
  width: 350px;
  background: #666666;
  overflow: auto;
`;
const ColorApplyButton = styled(Button)`
  padding: 3px 15px 5px;
`;

const Sidebar = () => {
  const dispatch = useDispatch();

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const layerList = useSelector((state) => state.layerReducer.list);
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const uploadList = useSelector((state) => state.uploadReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const basePaints = useSelector((state) => state.basePaintReducer.list);

  const baseColor =
    currentScheme.base_color === "transparent"
      ? currentScheme.base_color
      : "#" + currentScheme.base_color;
  const [dialog, setDialog] = useState(null);
  const [colorInput, setColorInput] = useState(baseColor);
  const [colorDirty, setColorDirty] = useState(false);

  const handleOpenBase = (base) => {
    dispatch(createLayersFromBasePaint(currentScheme.id, base));
    setDialog(null);
  };
  const handleOpenShape = (shape) => {
    dispatch(createLayerFromShape(currentScheme.id, shape, frameSize));
    setDialog(null);
  };
  const handleOpenLogo = (logo) => {
    dispatch(createLayerFromLogo(currentScheme.id, logo, frameSize));
    setDialog(null);
  };
  const handleOpenUpload = (upload) => {
    dispatch(createLayerFromUpload(currentScheme.id, upload, frameSize));
    setDialog(null);
  };
  const handleCreateText = (values) => {
    dispatch(createTextLayer(currentScheme.id, values, frameSize));
    setDialog(null);
  };

  const handleChangeBasePaintColor = (color) => {
    dispatch(changeBaseColor(currentScheme.id, color));
    setColorInput(color);
  };
  const handleChangeBasePaintColorInput = (color) => {
    setColorInput(color);
    if (color !== baseColor) setColorDirty(true);
    else setColorDirty(false);
  };
  const handleApplyBasePaintColor = () => {
    dispatch(changeBaseColor(currentScheme.id, colorInput));
    setColorDirty(false);
  };

  return (
    <Wrapper p={3}>
      <TitleBar />
      <PartGroup
        title="Car Parts"
        layerList={layerList.filter(
          (item) => item.layer_type === LayerTypes.CAR
        )}
        disableLock={true}
        disableDnd={true}
      />
      <PartGroup
        title="Logos & Text"
        layerList={layerList.filter(
          (item) =>
            item.layer_type === LayerTypes.LOGO ||
            item.layer_type === LayerTypes.TEXT ||
            item.layer_type === LayerTypes.UPLOAD
        )}
        actions={[
          {
            onClick: () => setDialog(DialogTypes.UPLOAD),
            icon: faFolderOpen,
          },
          {
            onClick: () => setDialog(DialogTypes.LOGO),
            icon: faImage,
          },
          {
            onClick: () => setDialog(DialogTypes.TEXT),
            icon: faFont,
          },
        ]}
      />
      <PartGroup
        title="Shapes"
        layerList={layerList.filter(
          (item) => item.layer_type === LayerTypes.OVERLAY
        )}
        actions={[
          {
            onClick: () => setDialog(DialogTypes.SHAPE),
            icon: faShapes,
          },
        ]}
      />
      <PartGroup
        title="Base Paint"
        layerList={layerList.filter(
          (item) => item.layer_type === LayerTypes.BASE
        )}
        actions={[
          {
            onClick: () => setDialog(DialogTypes.BASEPAINT),
            icon: faCar,
          },
        ]}
        disableLock={true}
        extraChildren={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <ColorPickerInput
              value={colorInput}
              onChange={handleChangeBasePaintColor}
              onInputChange={handleChangeBasePaintColorInput}
            />
            {colorDirty ? (
              <ColorApplyButton
                onClick={handleApplyBasePaintColor}
                variant="outlined"
              >
                Apply
              </ColorApplyButton>
            ) : (
              <></>
            )}
          </Box>
        }
      />

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
        onCreate={handleCreateText}
        onCancel={() => setDialog(null)}
      />
    </Wrapper>
  );
};

export default Sidebar;
