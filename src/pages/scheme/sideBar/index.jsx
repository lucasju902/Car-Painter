import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { Palette, DialogTypes, LayerTypes } from "../../../constants";

import { Box, TextField } from "@material-ui/core";
import { ColorPicker } from "material-ui-color";

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

const CustomColorPicker = styled(ColorPicker)`
  .MuiInputBase-input {
    width: 70px;
    border-bottom: 1px solid #8a8a8a;
  }
`;
const ColorInputField = styled(TextField)`
  width: 80px;
  .MuiInputBase-input.Mui-disabled {
    color: white;
  }
`;
const Wrapper = styled(Box)`
  width: 350px;
  background: #666666;
  overflow: auto;
`;

const Sidebar = () => {
  const dispatch = useDispatch();

  const [dialog, setDialog] = useState(null);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const layerList = useSelector((state) => state.layerReducer.list);
  const overlayList = useSelector((state) => state.overlayReducer.list);
  const logoList = useSelector((state) => state.logoReducer.list);
  const uploadList = useSelector((state) => state.uploadReducer.list);
  const fontList = useSelector((state) => state.fontReducer.list);
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const basePaints = useSelector((state) => state.basePaintReducer.list);

  const handleOpenBase = (base) => {
    const count = layerList.filter(
      (item) => LayerTypes.BASE === item.layer_type
    ).length;
    dispatch(createLayersFromBasePaint(currentScheme.id, base, count + 1));
    setDialog(null);
  };
  const handleOpenShape = (shape) => {
    const count = layerList.filter(
      (item) => LayerTypes.OVERLAY === item.layer_type
    ).length;
    dispatch(
      createLayerFromShape(currentScheme.id, shape, count + 1, frameSize)
    );
    setDialog(null);
  };
  const handleOpenLogo = (logo) => {
    const count = layerList.filter((item) =>
      [LayerTypes.LOGO, LayerTypes.UPLOAD, LayerTypes.TEXT].includes(
        item.layer_type
      )
    ).length;
    dispatch(createLayerFromLogo(currentScheme.id, logo, count + 1, frameSize));
    setDialog(null);
  };
  const handleOpenUpload = (upload) => {
    const count = layerList.filter((item) =>
      [LayerTypes.LOGO, LayerTypes.UPLOAD, LayerTypes.TEXT].includes(
        item.layer_type
      )
    ).length;
    dispatch(
      createLayerFromUpload(currentScheme.id, upload, count + 1, frameSize)
    );
    setDialog(null);
  };
  const handleCreateText = (values) => {
    const count = layerList.filter((item) =>
      [LayerTypes.LOGO, LayerTypes.UPLOAD, LayerTypes.TEXT].includes(
        item.layer_type
      )
    ).length;
    dispatch(createTextLayer(currentScheme.id, values, count + 1, frameSize));
    setDialog(null);
  };

  const handleChangeBasePaintColor = (color) => {
    console.log("Color: ", color);
    dispatch(changeBaseColor(currentScheme.id, color.css.backgroundColor));
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
          <Box display="flex" alignItems="center">
            <CustomColorPicker
              value={
                currentScheme.base_color === "transparent"
                  ? currentScheme.base_color
                  : "#" + currentScheme.base_color
              }
              deferred
              onChange={handleChangeBasePaintColor}
              palette={Palette}
              hideTextfield
            />
            <ColorInputField
              value={
                currentScheme.base_color === "transparent"
                  ? currentScheme.base_color
                  : "#" + currentScheme.base_color
              }
              disabled
            />
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
