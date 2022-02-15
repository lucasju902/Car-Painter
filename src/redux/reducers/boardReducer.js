import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import { MouseModes } from "constant";
import { HistoryActions } from "constant";
import {
  updateLayer,
  deleteLayer,
  insertToList as insertToLayerList,
  setCurrent as setCurrentLayer,
} from "./layerReducer";
import { updateScheme } from "./schemeReducer";
import { setMessage } from "./messageReducer";
import LayerService from "services/layerService";
import { PaintingGuides, ViewModes } from "constant";

const initialState = {
  frameSize: {
    width: 1024,
    height: 1024,
  },
  showProperties: true,
  showLayers: true,
  paintingGuides: [PaintingGuides.CARMASK],
  zoom: 1,
  pressedKey: null,
  pressedEventKey: null,
  boardRotate: 0,
  mouseMode: MouseModes.DEFAULT,
  actionHistory: [],
  actionHistoryIndex: -1,
  viewMode: ViewModes.NORMAL_VIEW,
  previousPath: "",
};

export const slice = createSlice({
  name: "boardReducer",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setFrameSize: (state, action) => {
      state.frameSize = action.payload;
    },
    clearFrameSize: (state, action) => {
      state.frameSize = initialState.frameSize;
    },
    setFrameSizeToMax: (state, action) => {
      let size = action.payload;
      let originSize = state.frameSize;
      state.frameSize = {
        width: Math.max(size.width, originSize.width),
        height: Math.max(size.height, originSize.height),
      };
    },
    setPressedKey: (state, action) => {
      state.pressedKey = action.payload;
    },
    setPressedEventKey: (state, action) => {
      state.pressedEventKey = action.payload;
    },
    setShowProperties: (state, action) => {
      state.showProperties = action.payload;
    },
    setShowLayers: (state, action) => {
      state.showLayers = action.payload;
    },
    setBoardRotate: (state, action) => {
      state.boardRotate = action.payload;
    },
    setPaintingGuides: (state, action) => {
      state.paintingGuides = [...action.payload];
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setMouseMode: (state, action) => {
      state.mouseMode = action.payload;
    },
    pushToActionHistory: (state, action) => {
      let history = [...state.actionHistory];
      history = history.slice(0, state.actionHistoryIndex + 1);
      history.push(action.payload);
      state.actionHistory = history;
      state.actionHistoryIndex = state.actionHistory.length - 1;
    },
    setActionHistory: (state, action) => {
      state.actionHistory = action.payload;
    },
    setActionHistoryIndex: (state, action) => {
      state.actionHistoryIndex = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setPreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
  },
});

export const {
  setFrameSize,
  clearFrameSize,
  setFrameSizeToMax,
  setPaintingGuides,
  setZoom,
  setPressedKey,
  setPressedEventKey,
  setBoardRotate,
  setMouseMode,
  setShowProperties,
  setShowLayers,
  pushToActionHistory,
  setActionHistory,
  setActionHistoryIndex,
  reset,
  setViewMode,
  setPreviousPath,
} = slice.actions;

export default slice.reducer;

export const backUpLayer = (layerToClone) => async (dispatch, getState) => {
  try {
    let actionHistory = JSON.parse(
      JSON.stringify(getState().boardReducer.actionHistory)
    );
    const layer = await LayerService.createLayer({
      ..._.omit(layerToClone, ["id"]),
      layer_data: JSON.stringify({
        ...layerToClone.layer_data,
      }),
    });
    for (let action of actionHistory) {
      if (
        [
          HistoryActions.LAYER_ADD_ACTION,
          HistoryActions.LAYER_CHANGE_ACTION,
          HistoryActions.LAYER_DELETE_ACTION,
        ].includes(action.action)
      ) {
        if (action.data && action.data.id === layerToClone.id) {
          action.data.id = layer.id;
        }
        if (action.prev_data && action.prev_data.id === layerToClone.id) {
          action.prev_data.id = layer.id;
        }
        if (action.next_data && action.next_data.id === layerToClone.id) {
          action.next_data.id = layer.id;
        }
      }
    }
    dispatch(setActionHistory(actionHistory));
    dispatch(insertToLayerList(layer));
    dispatch(setCurrentLayer(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const historyActionBack = () => async (dispatch, getState) => {
  const actionHistory = getState().boardReducer.actionHistory;
  const actionHistoryIndex = getState().boardReducer.actionHistoryIndex;

  if (actionHistoryIndex > -1) {
    switch (actionHistory[actionHistoryIndex].action) {
      case HistoryActions.LAYER_CHANGE_ACTION:
        dispatch(
          updateLayer(actionHistory[actionHistoryIndex].prev_data, false)
        );
        break;
      case HistoryActions.LAYER_ADD_ACTION:
        dispatch(deleteLayer(actionHistory[actionHistoryIndex].data, false));
        break;
      case HistoryActions.LAYER_DELETE_ACTION:
        dispatch(backUpLayer(actionHistory[actionHistoryIndex].data));
        break;
      case HistoryActions.SCHEME_CHANGE_ACTION:
        dispatch(
          updateScheme(actionHistory[actionHistoryIndex].prev_data, false)
        );
        break;
      default:
        break;
    }
    dispatch(setActionHistoryIndex(actionHistoryIndex - 1));
  }
};

export const historyActionUp = () => async (dispatch, getState) => {
  const actionHistory = getState().boardReducer.actionHistory;
  const actionHistoryIndex = getState().boardReducer.actionHistoryIndex;

  if (
    actionHistory.length > 0 &&
    actionHistoryIndex < actionHistory.length - 1
  ) {
    switch (actionHistory[actionHistoryIndex + 1].action) {
      case HistoryActions.LAYER_CHANGE_ACTION:
        dispatch(
          updateLayer(actionHistory[actionHistoryIndex + 1].next_data, false)
        );
        break;
      case HistoryActions.LAYER_ADD_ACTION:
        dispatch(backUpLayer(actionHistory[actionHistoryIndex + 1].data));
        break;
      case HistoryActions.LAYER_DELETE_ACTION:
        dispatch(
          deleteLayer(actionHistory[actionHistoryIndex + 1].data, false)
        );
        break;
      case HistoryActions.SCHEME_CHANGE_ACTION:
        dispatch(
          updateScheme(actionHistory[actionHistoryIndex + 1].next_data, false)
        );
        break;
      default:
        break;
    }
    dispatch(setActionHistoryIndex(actionHistoryIndex + 1));
  }
};
