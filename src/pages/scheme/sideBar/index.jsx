import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { LayerTypes } from "constant";

import { Box, Button } from "@material-ui/core";

import TitleBar from "./TitleBar";
import PartGroup from "./PartGroup";
import DrawerBar from "./DrawerBar";

import { changeBaseColor } from "redux/reducers/schemeReducer";
import ColorPickerInput from "components/ColorPickerInput";

const LayerWrapper = styled(Box)`
  width: 300px;
  background: #666666;
  overflow: auto;
`;
const TitleWrapper = styled(Box)`
  background: #666666;
`;
const Wrapper = styled(Box)`
  height: calc(100% - 46px);
  position: relative;
`;
const ColorApplyButton = styled(Button)`
  padding: 3px 15px 5px;
`;

const Sidebar = (props) => {
  const { dialog, setDialog, focusBoard } = props;

  const dispatch = useDispatch();

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const layerList = useSelector((state) => state.layerReducer.list);

  const baseColor = useMemo(
    () =>
      currentScheme.base_color === "transparent"
        ? currentScheme.base_color
        : "#" + currentScheme.base_color,
    [currentScheme.base_color]
  );

  const [colorInput, setColorInput] = useState(baseColor);
  const [colorDirty, setColorDirty] = useState(false);

  useEffect(() => {
    setColorInput(baseColor);
  }, [baseColor]);

  const handleChangeBasePaintColor = (color) => {
    dispatch(changeBaseColor(currentScheme.id, color));
    setColorInput(color);
    setColorDirty(false);
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
    <Box display="flex" flexDirection="column">
      <TitleWrapper px={3}>
        <TitleBar />
      </TitleWrapper>
      <Wrapper display="flex">
        <DrawerBar
          dialog={dialog}
          setDialog={setDialog}
          focusBoard={focusBoard}
        />
        <LayerWrapper pr={3} pb={2}>
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
          />
          <PartGroup
            title="Shapes"
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.SHAPE
            )}
          />
          <PartGroup
            title="Overlays"
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.OVERLAY
            )}
          />
          <PartGroup
            title="Base Paint"
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.BASE
            )}
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
        </LayerWrapper>
      </Wrapper>
    </Box>
  );
};

export default Sidebar;
