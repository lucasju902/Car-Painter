import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import SocketClient from "utils/socketClient";

import {
  LayerTypes,
  DefaultLayer,
  AllowedLayerProps,
  HistoryActions,
  DrawingStatus,
  MouseModes,
} from "constant";
import {
  fitPoints,
  getNameFromUploadFileName,
  parseLayer,
  rotatePoint,
} from "helper";
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

export const slice = createSlice({
  name: "layerReducer",
  initialState,
  reducers: {
    reset: (state) => initialState,
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
  reset,
} = slice.actions;

export default slice.reducer;

export const createLayersFromBasePaint = (
  schemeID,
  basePaintItemOrIndex,
  legacyMode
) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const currentUser = getState().authReducer.user;
    // let layer_order = order;
    let baseData = legacyMode
      ? basePaintItemOrIndex.base_data
      : Array.from({ length: 3 }, (_, i) => i + 1); // There are 3 basepaints for each carMake.

    for (let base_item of baseData) {
      const AllowedLayerTypes = AllowedLayerProps[LayerTypes.BASE];
      const layer = await LayerService.createLayer({
        ...DefaultLayer,
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        layer_data: legacyMode
          ? JSON.stringify({
              ..._.pick(
                { ...DefaultLayer.layer_data, ...base_item },
                AllowedLayerTypes.filter((item) =>
                  item.includes("layer_data.")
                ).map((item) => item.replace("layer_data.", ""))
              ),
              id: basePaintItemOrIndex.id,
              opacity: 1,
            })
          : JSON.stringify({
              ..._.pick(
                { ...DefaultLayer.layer_data },
                AllowedLayerTypes.filter((item) =>
                  item.includes("layer_data.")
                ).map((item) => item.replace("layer_data.", ""))
              ),
              name: `Base Pattern ${base_item}`,
              basePaintIndex: basePaintItemOrIndex,
              img: `${base_item}.png`,
              opacity: 1,
              color:
                base_item === 1
                  ? "#ff0000"
                  : base_item === 2
                  ? "#00ff00"
                  : "#0000ff",
            }),
      });
      SocketClient.emit("client-create-layer", {
        data: layer,
        socketID: SocketClient.socket.id,
        userID: currentUser.id,
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
    const currentUser = getState().authReducer.user;
    const guide_data = getState().schemeReducer.current.guide_data;

    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.OVERLAY];
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.OVERLAY,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          DefaultLayer.layer_data,
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        ),
        id: shape.id,
        name: shape.name,
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: shape.overlay_file,
        preview_file: shape.overlay_thumb,
        sizeLocked: false,
        color: guide_data.default_shape_color,
        opacity: guide_data.default_shape_opacity || 1,
        scolor: guide_data.default_shape_scolor,
        stroke: guide_data.default_shape_stroke || 0,
        stroke_scale: shape.stroke_scale,
        default_width: shape.default_width || 0,
        default_height: shape.default_height || 0,
      }),
    });
    SocketClient.emit("client-create-layer", {
      data: layer,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
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
    const currentUser = getState().authReducer.user;
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.LOGO];
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.LOGO,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          DefaultLayer.layer_data,
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        ),
        id: logo.id,
        name: logo.name,
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: logo.source_file,
        preview_file: logo.preview_file,
      }),
    });
    SocketClient.emit("client-create-layer", {
      data: layer,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
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
    const currentUser = getState().authReducer.user;
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.UPLOAD];
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.UPLOAD,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          DefaultLayer.layer_data,
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        ),
        id: upload.id,
        name: getNameFromUploadFileName(upload.file_name, currentUser),
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: upload.file_name,
        preview_file: upload.file_name,
      }),
    });
    SocketClient.emit("client-create-layer", {
      data: layer,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
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
    const currentUser = getState().authReducer.user;
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.TEXT];
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      layer_type: LayerTypes.TEXT,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          { ...DefaultLayer.layer_data, ...textObj },
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replace("layer_data.", ""))
        ),
        name: textObj.text,
        rotation: textObj.rotation - boardRotate,
        left: position.x,
        top: position.y,
      }),
    });
    SocketClient.emit("client-create-layer", {
      data: layer,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
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
  centerPosition,
  callback
) => async (dispatch, getState) => {
  if (layerToClone) {
    dispatch(setLoading(true));
    try {
      const currentUser = getState().authReducer.user;
      const offset = rotatePoint(
        layerToClone.layer_data.width ? -layerToClone.layer_data.width / 2 : 0,
        layerToClone.layer_data.height
          ? -layerToClone.layer_data.height / 2
          : 0,
        layerToClone.layer_data.rotation || 0
      );
      const layer = await LayerService.createLayer({
        ..._.omit(layerToClone, ["id"]),
        layer_order: 0,
        layer_data: JSON.stringify({
          ...layerToClone.layer_data,
          name: layerToClone.layer_data.name + " copy",
          left: samePosition
            ? layerToClone.layer_data.left
            : centerPosition.x + offset.x,
          top: samePosition
            ? layerToClone.layer_data.top
            : centerPosition.y + offset.y,
        }),
      });
      SocketClient.emit("client-create-layer", {
        data: layer,
        socketID: SocketClient.socket.id,
        userID: currentUser.id,
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
      if (callback) callback();
    } catch (err) {
      dispatch(setMessage({ message: err.message }));
    }
    dispatch(setLoading(false));
  }
};

export const createShape = (schemeID, newlayer) => async (
  dispatch,
  getState
) => {
  dispatch(setLoading(true));
  try {
    const currentUser = getState().authReducer.user;
    const AllowedLayerTypes =
      AllowedLayerProps[LayerTypes.SHAPE][newlayer.layer_data.type];
    const layerData = _.pick(
      {
        ...DefaultLayer.layer_data,
        ...newlayer.layer_data,
      },
      AllowedLayerTypes.filter((item) =>
        item.includes("layer_data.")
      ).map((item) => item.replace("layer_data.", ""))
    );
    if (
      [
        MouseModes.PEN,
        MouseModes.LINE,
        MouseModes.POLYGON,
        MouseModes.ARROW,
      ].includes(layerData.type)
    ) {
      const [leftTopOffset, newPoints] = fitPoints(layerData.points);
      layerData.left += leftTopOffset.x;
      layerData.top += leftTopOffset.y;
      layerData.points = newPoints;
    }
    const layer = await LayerService.createLayer({
      ...DefaultLayer,
      ...newlayer,
      layer_type: LayerTypes.SHAPE,
      scheme_id: schemeID,
      layer_data: JSON.stringify(layerData),
    });
    SocketClient.emit("client-create-layer", {
      data: layer,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
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
    const currentUser = getState().authReducer.user;
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
      data: {
        ...configuredLayer,
        layer_data: JSON.stringify(configuredLayer.layer_data),
      },
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
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
  dispatch,
  getState
) => {
  // dispatch(setLoading(true));

  try {
    const currentUser = getState().authReducer.user;
    dispatch(deleteListItem(layer));
    dispatch(setCurrent(null));
    // await LayerService.deleteLayer(layer.id);
    SocketClient.emit("client-delete-layer", {
      data: { ...layer },
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
    });
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
