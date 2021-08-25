import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { colorValidator } from "helper";
import { LayerTypes } from "constant";

import { Box, Button, Typography } from "@material-ui/core";
import { ColorPickerInput } from "components/common";
import { TitleBar, PartGroup, DrawerBar } from "./components";

import { updateScheme } from "redux/reducers/schemeReducer";
import { setShowProperties } from "redux/reducers/boardReducer";

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

export const SideBar = (props) => {
  const {
    dialog,
    setDialog,
    editable,
    stageRef,
    focusBoard,
    hoveredLayerJSON,
    onBack,
    onChangeHoverJSONItem,
  } = props;

  const dispatch = useDispatch();

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const layerList = useSelector((state) => state.layerReducer.list);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);

  const baseColor = useMemo(
    () =>
      currentScheme.base_color === "transparent"
        ? currentScheme.base_color
        : "#" + currentScheme.base_color,
    [currentScheme.base_color]
  );

  const [colorInput, setColorInput] = useState(baseColor);
  const [colorDirty, setColorDirty] = useState(false);

  const pickerValue = useMemo(
    () => (colorValidator(colorInput) ? colorInput : baseColor),
    [colorInput, baseColor]
  );

  useEffect(() => {
    setColorInput(baseColor);
  }, [baseColor]);

  const handleChangeBasePaintColor = useCallback(
    (color) => {
      let correctedColor = color;
      if (correctedColor[0] === "#" && correctedColor.length > 7) {
        correctedColor = correctedColor.slice(0, 7);
      }
      let base_color = correctedColor;
      if (base_color !== "transparent") {
        base_color = base_color.replace("#", "");
      }
      dispatch(updateScheme({ id: currentScheme.id, base_color }));
      setColorInput(correctedColor);
      setColorDirty(false);
    },
    [dispatch, currentScheme && currentScheme.id, setColorInput, setColorDirty]
  );
  const handleChangeBasePaintColorInput = useCallback(
    (color) => {
      setColorInput(color);
      if (color !== baseColor) setColorDirty(true);
      else setColorDirty(false);
    },
    [baseColor, setColorInput, setColorDirty]
  );
  const handleApplyBasePaintColor = useCallback(() => {
    let base_color = colorInput;
    if (base_color !== "transparent") {
      base_color = base_color.replace("#", "");
    }
    dispatch(updateScheme({ id: currentScheme.id, base_color }));
    setColorDirty(false);
  }, [dispatch, currentScheme && currentScheme.id, colorInput, setColorDirty]);
  const handleDoubleClickItem = useCallback(() => {
    dispatch(setShowProperties(true));
  }, [dispatch]);

  return (
    <Box display="flex" flexDirection="column">
      <TitleWrapper px={3}>
        <TitleBar editable={editable} onBack={onBack} />
      </TitleWrapper>
      <Wrapper display="flex">
        <DrawerBar
          dialog={dialog}
          setDialog={setDialog}
          stageRef={stageRef}
          focusBoard={focusBoard}
          editable={editable}
        />
        <LayerWrapper pr={3} pb={2}>
          <PartGroup
            title={currentCarMake ? currentCarMake.name : ""}
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.CAR
            )}
            disabled={!editable}
            disableLock={true}
            disableDnd={true}
            hoveredLayerJSON={hoveredLayerJSON}
            onChangeHoverJSONItem={onChangeHoverJSONItem}
            onDoubleClickItem={handleDoubleClickItem}
          />
          <PartGroup
            title="Logos & Text"
            layerList={layerList.filter(
              (item) =>
                item.layer_type === LayerTypes.LOGO ||
                item.layer_type === LayerTypes.TEXT ||
                item.layer_type === LayerTypes.UPLOAD
            )}
            disabled={!editable}
            hoveredLayerJSON={hoveredLayerJSON}
            onChangeHoverJSONItem={onChangeHoverJSONItem}
            onDoubleClickItem={handleDoubleClickItem}
          />
          <PartGroup
            title="Shapes"
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.SHAPE
            )}
            disabled={!editable}
            hoveredLayerJSON={hoveredLayerJSON}
            onChangeHoverJSONItem={onChangeHoverJSONItem}
            onDoubleClickItem={handleDoubleClickItem}
          />
          <PartGroup
            title="Overlays"
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.OVERLAY
            )}
            disabled={!editable}
            hoveredLayerJSON={hoveredLayerJSON}
            onChangeHoverJSONItem={onChangeHoverJSONItem}
            onDoubleClickItem={handleDoubleClickItem}
          />
          <PartGroup
            title="Base Paint"
            layerList={layerList.filter(
              (item) => item.layer_type === LayerTypes.BASE
            )}
            disabled={!editable}
            disableLock={true}
            hoveredLayerJSON={hoveredLayerJSON}
            onChangeHoverJSONItem={onChangeHoverJSONItem}
            onDoubleClickItem={handleDoubleClickItem}
            extraChildren={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <ColorPickerInput
                  separateValues={true}
                  valuePicker={pickerValue}
                  value={colorInput}
                  disabled={!editable}
                  onChange={handleChangeBasePaintColor}
                  onInputChange={handleChangeBasePaintColorInput}
                />
                {colorDirty && colorValidator(colorInput) ? (
                  <ColorApplyButton
                    onClick={handleApplyBasePaintColor}
                    variant="outlined"
                  >
                    Apply
                  </ColorApplyButton>
                ) : !colorValidator(colorInput) ? (
                  <Typography color="secondary" variant="body2">
                    Invalid Color
                  </Typography>
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

export default SideBar;
