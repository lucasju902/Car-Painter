import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import SocketClient from "utils/socketClient";

import {
  LayerTypes,
  DefaultLayer,
  AllowedLayerProps,
  HistoryActions,
} from "constant";
import { parseLayer } from "helper";
import LayerService from "services/layerService";
import { setMessage } from "./messageReducer";
import { pushToActionHistory } from "./boardReducer";

const initialState = {
  list: [],
  current: null,
  hoveredJSON: {},
  clipboard: null,
  drawingStatus: null,
  loadedStatuses: {},
  loading: false,
};

export const DrawingStatus = {
  CLEAR_COMMAND: "CLEAR_COMMAND",
  ADD_TO_SHAPE: "ADD_TO_SHAPE",
};

export const slice = createSlice({
  name: "layerReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      let list = action.payload;
      for (let item of list) {
        if (typeof item.layer_data === "string") {
          item.layer_data = JSON.parse(item.layer_data);
        }
      }
      state.list = list;
    },
    insertToList: (state, action) => {
      let layer = action.payload;
      if (typeof layer.layer_data === "string") {
        layer.layer_data = JSON.parse(layer.layer_data);
      }
      state.list.push(layer);
    },
    concatList: (state, action) => {
      let list = action.payload;
      for (let item of list) {
        if (typeof item.layer_data === "string") {
          item.layer_data = JSON.parse(item.layer_data);
        }
      }
      state.list = state.list.concat(list);
    },
    updateListItem: (state, action) => {
      let layerList = [...state.list];
      let foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        let item = action.payload;
        if (typeof item.layer_data === "string") {
          item.layer_data = JSON.parse(item.layer_data);
        }
        layerList[foundIndex] = item;
        state.list = layerList;
      }
    },
    deleteItemsByUploadID: (state, action) => {
      let layerList = [...state.list];
      state.list = layerList.filter(
        (item) =>
          item.layer_type !== LayerTypes.UPLOAD ||
          item.layer_data.id !== action.payload
      );
    },
    deleteListItem: (state, action) => {
      let layerList = [...state.list];
      let foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        layerList.splice(foundIndex, 1);
        state.list = layerList;
      }
    },
    setCurrent: (state, action) => {
      let layer = action.payload;
      if (layer && typeof layer.layer_data === "string") {
        layer.layer_data = JSON.parse(layer.layer_data);
      }
      state.current = layer;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
    setHoveredJSON: (state, action) => {
      state.hoveredJSON = action.payload;
    },
    setHoveredJSONItem: (state, action) => {
      let { key, value } = action.payload;
      state.hoveredJSON[key] = value;
    },
    setClipboard: (state, action) => {
      let layer = action.payload;
      if (layer && typeof layer.layer_data === "string") {
        layer.layer_data = JSON.parse(layer.layer_data);
      }
      state.clipboard = layer;
    },
    setDrawingStatus: (state, action) => {
      state.drawingStatus = action.payload;
    },
    setLoadedStatusAll: (state, action) => {
      state.loadedStatuses = action.payload;
    },
    setLoadedStatus: (state, action) => {
      let { key, value } = action.payload;
      state.loadedStatuses[key] = value;
    },
  },
});

const { setLoading } = slice.actions;
export const {
  setCurrent,
  setList,
  setDrawingStatus,
  insertToList,
  concatList,
  updateListItem,
  deleteListItem,
  setClipboard,
  setHoveredJSON,
  setHoveredJSONItem,
  deleteItemsByUploadID,
  setLoadedStatusAll,
  setLoadedStatus,
  clearCurrent,
} = slice.actions;

export default slice.reducer;

export const createLayersFromBasePaint = (
  schemeID,
  basePaintItemOrIndex,
  legacyMode
) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    // let layer_order = order;
    let baseData = legacyMode
      ? basePaintItemOrIndex.base_data
      : Array.from({ length: 3 }, (_, i) => i + 1); // There are 3 basepaints for each carMake.

    for (let base_item of baseData) {
      const layer = await LayerService.createLayer({
        ...DefaultLayer,
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        layer_data: legacyMode
          ? JSON.stringify({
              ...DefaultLayer.layer_data,
              ...base_item,
              id: basePaintItemOrIndex.id,
              opacity: 1,
            })
          : JSON.stringify({
              ...DefaultLayer.layer_data,
              name: `Base Pattern ${base_item}`,
              basePaintIndex: basePaintItemOrIndex,
              img: `${base_item}.png`,
              opacity: 1,
            }),
      });
      dispatch(insertToList(layer));
      dispatch(setCurrent(layer));
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_ADD_ACTION,
          data: parseLayer(layer),
        })
      );
    }
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromOverlay = (schemeID, shape, position) => async (
  dispatch,
  getState
) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.OVERLAY,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ...DefaultLayer.layer_data,
        id: shape.id,
        name: shape.name,
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: shape.overlay_file,
        preview_file: shape.overlay_thumb,
      }),
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromLogo = (schemeID, logo, position) => async (
  dispatch,
  getState
) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.LOGO,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ...DefaultLayer.layer_data,
        id: logo.id,
        name: logo.name,
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: logo.source_file,
        preview_file: logo.preview_file,
      }),
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromUpload = (schemeID, upload, position) => async (
  dispatch,
  getState
) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.UPLOAD,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ...DefaultLayer.layer_data,
        id: upload.id,
        name: upload.file_name.substring(
          upload.file_name.lastIndexOf("uploads/") + "uploads/".length,
          upload.file_name.lastIndexOf(".")
        ),
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: upload.file_name,
        preview_file: upload.file_name,
      }),
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createTextLayer = (schemeID, textObj, position) => async (
  dispatch,
  getState
) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.TEXT,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ...DefaultLayer.layer_data,
        ...textObj,
        name: textObj.text,
        rotation: textObj.rotation - boardRotate,
        left: position.x,
        top: position.y,
      }),
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const cloneLayer = (
  layerToClone,
  samePosition = false,
  pushingToHistory = true,
  centerPosition
) => async (dispatch) => {
  if (layerToClone) {
    dispatch(setLoading(true));
    try {
      const layer = await LayerService.createLayer({
        ..._.omit(layerToClone, ["id"]),
        layer_order: 0,
        layer_data: JSON.stringify({
          ...layerToClone.layer_data,
          name: layerToClone.layer_data.name + " copy",
          left: samePosition
            ? layerToClone.layer_data.left
            : centerPosition.x -
              (layerToClone.layer_data.width
                ? layerToClone.layer_data.width / 2
                : 0),
          top: samePosition
            ? layerToClone.layer_data.top
            : centerPosition.y -
              (layerToClone.layer_data.height
                ? layerToClone.layer_data.height / 2
                : 0),
        }),
      });
      dispatch(insertToList(layer));
      dispatch(setCurrent(layer));
      if (pushingToHistory)
        dispatch(
          pushToActionHistory({
            action: HistoryActions.LAYER_ADD_ACTION,
            data: parseLayer(layer),
          })
        );
    } catch (err) {
      dispatch(setMessage({ message: err.message }));
    }
    dispatch(setLoading(false));
  }
};

export const createShape = (schemeID, newlayer) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const AllowedLayerTypes =
      AllowedLayerProps[LayerTypes.SHAPE][newlayer.layer_data.type];
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      ...newlayer,
      layer_type: LayerTypes.SHAPE,
      scheme_id: schemeID,
      layer_data: JSON.stringify(
        _.pick(
          {
            ...DefaultLayer.layer_data,
            ...newlayer.layer_data,
          },
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        )
      ),
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
    dispatch(setDrawingStatus(DrawingStatus.CLEAR_COMMAND));
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateLayer = (layer, pushingToHistory = true) => async (
  dispatch,
  getState
) => {
  // dispatch(setLoading(true));
  let configuredLayer = {
    ...layer,
    layer_order: layer.layer_order || 1,
  };
  try {
    let previousLayer = getState().layerReducer.list.find(
      (item) => item.id === layer.id
    );

    dispatch(updateListItem(configuredLayer));
    const currentLayer = getState().layerReducer.current;
    if (currentLayer && currentLayer.id === configuredLayer.id) {
      dispatch(setCurrent(configuredLayer));
    }
    // await LayerService.updateLayer(configuredLayer.id, {
    //   ...configuredLayer,
    //   layer_data: JSON.stringify(configuredLayer.layer_data),
    // });
    SocketClient.emit("client-update-layer", {
      ...configuredLayer,
      layer_data: JSON.stringify(configuredLayer.layer_data),
    });

    if (pushingToHistory) {
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_CHANGE_ACTION,
          prev_data: previousLayer,
          next_data: configuredLayer,
        })
      );
    }
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};

export const updateLayerOnly = (layer) => async (dispatch, getState) => {
  let configuredLayer = {
    ...layer,
    layer_order: layer.layer_order || 1,
  };

  dispatch(updateListItem(configuredLayer));
  const currentLayer = getState().layerReducer.current;
  if (currentLayer && currentLayer.id === configuredLayer.id) {
    dispatch(setCurrent(configuredLayer));
  }
};

export const deleteLayer = (layer, pushingToHistory = true) => async (
  dispatch
) => {
  // dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(layer));
    dispatch(setCurrent(null));
    await LayerService.deleteLayer(layer.id);
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_DELETE_ACTION,
          data: layer,
        })
      );
    dispatch(
      setMessage({ message: "Deleted Layer successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};
