import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { colorValidator } from "helper";
import { FinishOptions, LayerTypes } from "constant";

import { Box, Typography, Grid, Select, MenuItem } from "@material-ui/core";
import { ColorPickerInput } from "components/common";
import { TitleBar, PartGroup, DrawerBar } from "./components";
import {
  LayerWrapper,
  TitleWrapper,
  Wrapper,
  ColorApplyButton,
} from "./SideBar.style";

import { updateScheme } from "redux/reducers/schemeReducer";
import { setShowProperties } from "redux/reducers/boardReducer";

export const SideBar = (props) => {
  const {
    dialog,
    setDialog,
    editable,
    stageRef,
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

  const handleChangeFinishColor = useCallback(
    (color) => {
      dispatch(updateScheme({ id: currentScheme.id, finish: color }));
    },
    [dispatch, currentScheme && currentScheme.id]
  );

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
              <>
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
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" height="100%">
                      <Typography variant="body1" color="textSecondary" mr={2}>
                        Finish
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      name="layer_data.finish"
                      variant="outlined"
                      value={currentScheme.finish || FinishOptions[0].value}
                      disabled={!editable}
                      onChange={(event) =>
                        handleChangeFinishColor(event.target.value)
                      }
                      fullWidth
                    >
                      {FinishOptions.map((finishItem, index) => (
                        <MenuItem value={finishItem.value} key={index}>
                          <Box
                            component="span"
                            bgcolor={finishItem.value}
                            height="20px"
                            width="20px"
                            mr={2}
                          ></Box>
                          {finishItem.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </>
            }
          />
        </LayerWrapper>
      </Wrapper>
    </Box>
  );
};

export default SideBar;
