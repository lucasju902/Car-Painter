import { createSlice } from "@reduxjs/toolkit";
import {
  MouseModes,
  HistoryActions,
  PaintingGuides,
  ViewModes,
} from "constant";
import {
  updateLayer,
  deleteLayer,
  createLayer,
  createLayerList,
  deleteLayerList,
} from "./layerReducer";
import { updateScheme } from "./schemeReducer";

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
  actionHistoryMoving: false,
  viewMode: ViewModes.NORMAL_VIEW,
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
    setActionHistoryMoving: (state, action) => {
      state.actionHistoryMoving = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
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
  setActionHistoryMoving,
  reset,
  setViewMode,
} = slice.actions;

export default slice.reducer;

export const historyActionBack = () => async (dispatch, getState) => {
  const actionHistory = getState().boardReducer.actionHistory;
  const actionHistoryIndex = getState().boardReducer.actionHistoryIndex;
  const actionHistoryMoving = getState().boardReducer.actionHistoryMoving;
  if (actionHistoryMoving) {
    return;
  }
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
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayer(actionHistory[actionHistoryIndex].data, false, () => {
            dispatch(setActionHistoryMoving(false));
          })
        );
        break;
      case HistoryActions.LAYER_LIST_ADD_ACTION:
        dispatch(
          deleteLayerList(actionHistory[actionHistoryIndex].data, false)
        );
        break;
      case HistoryActions.LAYER_LIST_DELETE_ACTION:
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayerList(actionHistory[actionHistoryIndex].data, false, () => {
            dispatch(setActionHistoryMoving(false));
          })
        );
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
  const actionHistoryMoving = getState().boardReducer.actionHistoryMoving;
  if (actionHistoryMoving) {
    return;
  }

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
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayer(actionHistory[actionHistoryIndex + 1].data, false, () => {
            dispatch(setActionHistoryMoving(false));
          })
        );
        break;
      case HistoryActions.LAYER_DELETE_ACTION:
        dispatch(
          deleteLayer(actionHistory[actionHistoryIndex + 1].data, false)
        );
        break;
      case HistoryActions.LAYER_LIST_ADD_ACTION:
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayerList(
            actionHistory[actionHistoryIndex + 1].data,
            false,
            () => {
              dispatch(setActionHistoryMoving(false));
            }
          )
        );
        break;
      case HistoryActions.LAYER_LIST_DELETE_ACTION:
        dispatch(
          deleteLayerList(actionHistory[actionHistoryIndex + 1].data, false)
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
