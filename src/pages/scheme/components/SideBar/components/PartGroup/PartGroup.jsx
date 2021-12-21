import React, { useState, useMemo, useCallback } from "react";

import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { ReactSortable } from "react-sortablejs";

import { MouseModes, LayerTypes } from "constant";
import {
  updateLayer,
  setCurrent as setCurrentLayer,
} from "redux/reducers/layerReducer";
import { setMouseMode } from "redux/reducers/boardReducer";

import { Box, Card, Collapse } from "@material-ui/core";
import { CustomCardHeader, CustomCardContent } from "./PartGroup.style";

import { PartItem } from "../PartItem";
import { PartAction } from "../PartAction";

export const PartGroup = (props) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const user = useSelector((state) => state.authReducer.user);
  const {
    layerList,
    title,
    disabled,
    actions,
    extraChildren,
    disableLock,
    disableDnd,
    hoveredLayerJSON,
    onChangeHoverJSONItem,
    onDoubleClickItem,
  } = props;

  const sortedList = useMemo(
    () => _.orderBy(layerList, ["layer_order"], ["asc"]),
    [layerList]
  );

  // useEffect(() => {
  //   for (let index in sortedList) {
  //     if (sortedList[index].layer_order !== parseInt(index) + 1) {
  //       console.log("updateLayer in PartGroup!");
  //       dispatch(
  //         updateLayer(
  //           {
  //             ...sortedList[index],
  //             layer_order: parseInt(index) + 1,
  //           },
  //           false
  //         )
  //       );
  //     }
  //   }
  // }, [dispatch, layerList.length, sortedList]);

  const handleExpandClick = useCallback(() => {
    setExpanded((preValue) => !preValue);
  }, [setExpanded]);
  const handleChangeLayer = useCallback(
    (list) => {
      for (let index in list) {
        const layer = layerList.find((item) => item.id == list[index].id);
        if (layer && layer.layer_order !== parseInt(index) + 1) {
          dispatch(
            updateLayer(
              {
                id: layer.id,
                layer_order: parseInt(index) + 1,
              },
              false
            )
          );
        }
      }
    },
    [layerList, dispatch]
  );
  const toggleField = useCallback(
    (id, field) => {
      const layer = layerList.find((item) => item.id === id);
      dispatch(
        updateLayer({
          id: layer.id,
          [field]: layer[field] ? 0 : 1,
        })
      );
    },
    [layerList, dispatch]
  );
  const selectLayer = useCallback(
    (layer) => {
      dispatch(setCurrentLayer(layer));
      dispatch(setMouseMode(MouseModes.DEFAULT));
    },
    [dispatch]
  );
  const hoverLayer = useCallback(
    (layer, flag) => {
      onChangeHoverJSONItem(layer.id, flag);
    },
    [onChangeHoverJSONItem]
  );
  const layerName = useCallback(
    (name, type) => {
      if (type === LayerTypes.UPLOAD && name.indexOf(user.id.toString()) === 0)
        return name.slice(user.id.toString().length + 1);
      return name;
    },
    [user]
  );

  return (
    <Box mb={2}>
      <Card>
        <CustomCardHeader
          title={title}
          action={
            <PartAction
              expanded={expanded}
              actions={actions}
              onExpandClick={handleExpandClick}
            />
          }
        />
        <Collapse in={expanded}>
          <CustomCardContent>
            <ReactSortable
              list={sortedList}
              setList={handleChangeLayer}
              animation={150}
              sort={!disableDnd && !disabled}
            >
              {sortedList.map((item) => (
                <PartItem
                  text={layerName(item.layer_data.name, item.layer_type)}
                  layer_visible={item.layer_visible}
                  layer_locked={item.layer_locked}
                  key={item.id}
                  item={item}
                  toggleField={toggleField}
                  selected={currentLayer && currentLayer.id === item.id}
                  hovered={hoveredLayerJSON[item.id]}
                  onSelect={selectLayer}
                  onDoubleClick={onDoubleClickItem}
                  onHover={hoverLayer}
                  disableLock={disableLock}
                  disabled={disabled}
                />
              ))}
            </ReactSortable>
            {extraChildren}
          </CustomCardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export default PartGroup;
