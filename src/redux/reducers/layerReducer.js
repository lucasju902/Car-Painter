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
  stringifyLayer,
} from "helper";
import LayerService from "services/layerService";
import { setMessage } from "./messageReducer";
import { pushToActionHistory } from "./boardReducer";

const initialState = {
  list: [],
  current: null,
  hoveredJSON: {},
  clipboard: null,
  cloningLayer: null,
  cloningQueue: [],
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
      state.list = action.payload.map((item) => parseLayer(item));
    },
    insertToList: (state, action) => {
      state.list.push(parseLayer(action.payload));
    },
    concatList: (state, action) => {
      state.list = state.list.concat(
        action.payload.map((item) => parseLayer(item))
      );
    },
    updateListItem: (state, action) => {
      let layerList = [...state.list];
      let foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        layerList[foundIndex] = parseLayer(action.payload);
        state.list = layerList;
      }
    },
    mergeListItem: (state, action) => {
      let layerList = [...state.list];
      let foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        layerList[foundIndex] = parseLayer({
          ...layerList[foundIndex],
          ...action.payload,
        });
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
      if (state.current && state.current.id === action.payload.id) {
        state.current = null;
      }
    },
    deleteListItems: (state, action) => {
      let layerList = [...state.list];
      state.list = layerList.filter((layer) =>
        action.payload.every((item) => item.id !== layer.id)
      );
      if (
        state.current &&
        action.payload.some((item) => item.id === state.current.id)
      ) {
        state.current = null;
      }
    },
    setCurrent: (state, action) => {
      state.current = parseLayer(action.payload);
    },
    mergeCurrent: (state, action) => {
      state.current = parseLayer({ ...state.current, ...action.payload });
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
      state.clipboard = parseLayer(action.payload);
    },
    setCloningLayer: (state, action) => {
      state.cloningLayer = parseLayer(action.payload);
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
    insertToCloningQueue: (state, action) => {
      state.cloningQueue.push(parseLayer(action.payload));
    },
    deleteCloningQueueByID: (state, action) => {
      let cloningQueue = [...state.cloningQueue];
      state.cloningQueue = cloningQueue.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

const { setLoading } = slice.actions;
export const {
  setCurrent,
  mergeCurrent,
  setList,
  setDrawingStatus,
  insertToList,
  concatList,
  updateListItem,
  mergeListItem,
  deleteListItem,
  deleteListItems,
  setClipboard,
  setCloningLayer,
  setHoveredJSON,
  setHoveredJSONItem,
  deleteItemsByUploadID,
  setLoadedStatusAll,
  setLoadedStatus,
  clearCurrent,
  reset,
  insertToCloningQueue,
  deleteCloningQueueByID,
} = slice.actions;

export default slice.reducer;

const shiftSimilarLayerOrders = (layer) => async (dispatch, getState) => {
  const currentUser = getState().authReducer.user;
  const layerList = getState().layerReducer.list;
  let filter = [];
  if ([LayerTypes.BASE].includes(layer.layer_type)) {
    filter = [LayerTypes.BASE];
  } else if ([LayerTypes.SHAPE].includes(layer.layer_type)) {
    filter = [LayerTypes.SHAPE];
  } else if ([LayerTypes.OVERLAY].includes(layer.layer_type)) {
    filter = [LayerTypes.OVERLAY];
  } else if (
    [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(
      layer.layer_type
    )
  ) {
    filter = [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD];
  }
  const filteredLayers = layerList.filter(
    (layerItem) =>
      filter.includes(layerItem.layer_type) && layerItem.id !== layer.id
  );
  for (let layerItem of filteredLayers) {
    dispatch(
      mergeListItem({
        ...layerItem,
        layer_order: layerItem.layer_order + 1,
      })
    );
    SocketClient.emit("client-update-layer", {
      data: {
        ...layerItem,
        layer_order: layerItem.layer_order + 1,
      },
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
    });
  }
};

export const createLayer = (
  layerInfo,
  pushingToHistory = true,
  callback = null
) => async (dispatch, getState) => {
  const currentUser = getState().authReducer.user;
  const layer = await LayerService.createLayer(stringifyLayer(layerInfo));
  SocketClient.emit("client-create-layer", {
    data: layer,
    socketID: SocketClient.socket.id,
    userID: currentUser.id,
  });

  dispatch(shiftSimilarLayerOrders(layer));

  dispatch(insertToList(layer));
  if (layer.layer_type !== LayerTypes.BASE) {
    dispatch(setCurrent(layer));
  }
  if (pushingToHistory) {
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  }
  if (callback) {
    callback();
  }
};

export const createLayerList = (layersInfo, pushingToHistory = true) => async (
  dispatch,
  getState
) => {
  const currentUser = getState().authReducer.user;
  const layerList = getState().layerReducer.list;
  const layers = [];
  for (let layerInfoItem of layersInfo) {
    layers.push(await LayerService.createLayer(stringifyLayer(layerInfoItem)));
  }

  SocketClient.emit("client-create-layer-list", {
    data: layers,
    socketID: SocketClient.socket.id,
    userID: currentUser.id,
  });

  let filter = [];
  if ([LayerTypes.BASE].includes(layers[0].layer_type)) {
    filter = [LayerTypes.BASE];
  } else if ([LayerTypes.SHAPE].includes(layers[0].layer_type)) {
    filter = [LayerTypes.SHAPE];
  } else if ([LayerTypes.OVERLAY].includes(layers[0].layer_type)) {
    filter = [LayerTypes.OVERLAY];
  } else if (
    [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(
      layers[0].layer_type
    )
  ) {
    filter = [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD];
  }
  const filteredLayers = layerList.filter(
    (layerItem) =>
      filter.includes(layerItem.layer_type) &&
      layers.every((item) => item.id !== layerItem.id)
  );
  for (let layerItem of filteredLayers) {
    dispatch(
      mergeListItem({
        ...layerItem,
        layer_order: layerItem.layer_order + layers.length,
      })
    );
    SocketClient.emit("client-update-layer", {
      data: {
        ...layerItem,
        layer_order: layerItem.layer_order + layers.length,
      },
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
    });
  }

  dispatch(concatList(layers));
  if (pushingToHistory) {
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_LIST_ADD_ACTION,
        data: layers.map((layer) => parseLayer(layer)),
      })
    );
  }
};

export const createLayersFromBasePaint = (
  schemeID,
  basePaintItemOrIndex,
  legacyMode
) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    let baseData = legacyMode
      ? basePaintItemOrIndex.base_data
      : Array.from({ length: 3 }, (_, i) => i + 1); // There are 3 basepaints for each carMake.

    const layers = [];
    let index = 0;
    for (let base_item of baseData) {
      const AllowedLayerTypes = AllowedLayerProps[LayerTypes.BASE];
      const layer = {
        ...DefaultLayer,
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        layer_order: baseData.length - index,
        layer_data: legacyMode
          ? JSON.stringify({
              ..._.pick(
                { ...DefaultLayer.layer_data, ...base_item },
                AllowedLayerTypes.filter((item) =>
                  item.includes("layer_data.")
                ).map((item) => item.replace("layer_data.", ""))
              ),
              id: basePaintItemOrIndex.id,
              img: base_item.img,
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
      };
      layers.push(layer);
      index++;
    }
    dispatch(createLayerList(layers));
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
    const guide_data = getState().schemeReducer.current.guide_data;

    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.OVERLAY];
    const layer = {
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
        stroke:
          guide_data.default_shape_stroke != null
            ? guide_data.default_shape_stroke
            : 1,
        stroke_scale: shape.stroke_scale,
      }),
    };
    dispatch(createLayer(layer));
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
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.LOGO];
    const layer = {
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
    };
    dispatch(createLayer(layer));
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
    const layer = {
      ...DefaultLayer,
      layer_type: LayerTypes.UPLOAD,
      scheme_id: schemeID,
      upload_id: upload.id,
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
        fromOldSource: upload.legacy_mode,
      }),
    };
    dispatch(createLayer(layer));
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
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.TEXT];
    const layer = {
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
    };
    dispatch(createLayer(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const cloneLayer = (
  layerToClone,
  samePosition = false,
  pushingToHistory = true,
  centerPosition = {},
  callback = null
) => async (dispatch, getState) => {
  if (layerToClone) {
    dispatch(setLoading(true));
    try {
      const boardRotate = getState().boardReducer.boardRotate;
      const offset = rotatePoint(
        layerToClone.layer_data.width ? -layerToClone.layer_data.width / 2 : 0,
        layerToClone.layer_data.height
          ? -layerToClone.layer_data.height / 2
          : 0,
        boardRotate
      );
      const layer = {
        ..._.omit(layerToClone, ["id"]),
        layer_order: 1,
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
      };
      dispatch(createLayer(layer, pushingToHistory, callback));
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
    const layer = {
      ...DefaultLayer,
      ...newlayer,
      layer_type: LayerTypes.SHAPE,
      scheme_id: schemeID,
      layer_data: JSON.stringify(layerData),
    };
    dispatch(
      createLayer(layer, true, () =>
        dispatch(setDrawingStatus(DrawingStatus.CLEAR_COMMAND))
      )
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
  try {
    const currentUser = getState().authReducer.user;
    let previousLayer = getState().layerReducer.list.find(
      (item) => item.id === layer.id
    );

    dispatch(mergeListItem(layer));
    const currentLayer = getState().layerReducer.current;
    if (currentLayer && currentLayer.id === layer.id) {
      dispatch(mergeCurrent(layer));
    }
    // await LayerService.updateLayer(configuredLayer.id, {
    //   ...configuredLayer,
    //   layer_data: JSON.stringify(configuredLayer.layer_data),
    // });
    let layerForSocket = { ...layer };
    if (layerForSocket.layer_data) {
      layerForSocket.layer_data = JSON.stringify(layerForSocket.layer_data);
    }
    SocketClient.emit("client-update-layer", {
      data: layerForSocket,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
    });

    if (pushingToHistory) {
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_CHANGE_ACTION,
          prev_data: previousLayer,
          next_data: {
            ...previousLayer,
            ...layer,
          },
        })
      );
    }
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};

export const updateLayerOnly = (layer) => async (dispatch, getState) => {
  dispatch(mergeListItem(layer));
  const currentLayer = getState().layerReducer.current;
  if (currentLayer && currentLayer.id === layer.id) {
    dispatch(mergeCurrent(layer));
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

export const deleteLayerList = (layerList, pushingToHistory = true) => async (
  dispatch,
  getState
) => {
  // dispatch(setLoading(true));

  try {
    const currentUser = getState().authReducer.user;

    dispatch(deleteListItems(layerList));
    dispatch(setCurrent(null));
    SocketClient.emit("client-delete-layer-list", {
      data: layerList,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
    });
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_LIST_DELETE_ACTION,
          data: layerList,
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
