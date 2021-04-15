import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import LayerService from "services/layerService";
import _ from "lodash";
import { LayerTypes } from "constant";

const initialState = {
  list: [],
  current: null,
  loading: false,
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
        layerList[foundIndex] = action.payload;
        state.list = layerList;
      }
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
  },
});

const { setLoading } = slice.actions;
export const {
  setCurrent,
  setList,
  insertToList,
  concatList,
  updateListItem,
  deleteListItem,
} = slice.actions;

export default slice.reducer;

export const createLayersFromBasePaint = (schemeID, base) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    // let layer_order = order;
    for (let base_item of base.base_data) {
      const layer = await LayerService.createLayer({
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        upload_id: 0,
        layer_data: JSON.stringify({
          ...base_item,
          color: undefined,
          id: base.id,
          opacity: 1,
        }),
        layer_visible: 1,
        layer_locked: 0,
        layer_order: 0,
        time_modified: 0,
        confirm: "",
      });
      dispatch(insertToList(layer));
      dispatch(setCurrent(layer));
    }
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromShape = (schemeID, shape, frameSize) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    const layer = await LayerService.createLayer({
      layer_type: LayerTypes.OVERLAY,
      scheme_id: schemeID,
      upload_id: 0,
      layer_data: JSON.stringify({
        id: shape.id,
        name: shape.name,
        rotation: 0,
        flip: 0,
        flop: 0,
        left: frameSize.width / 2,
        top: frameSize.height / 2,
        source_file: shape.overlay_file,
        preview_file: shape.overlay_thumb,
        opacity: 1,
        shadowColor: null,
        shadowBlur: 0,
        shadowOpacity: 1,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: 0,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromLogo = (schemeID, logo, frameSize) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    const layer = await LayerService.createLayer({
      layer_type: LayerTypes.LOGO,
      scheme_id: schemeID,
      upload_id: 0,
      layer_data: JSON.stringify({
        id: logo.id,
        name: logo.name,
        rotation: 0,
        flip: 0,
        flop: 0,
        left: frameSize.width / 2,
        top: frameSize.height / 2,
        source_file: logo.source_file,
        preview_file: logo.preview_file,
        opacity: 1,
        shadowColor: null,
        shadowBlur: 0,
        shadowOpacity: 1,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: 0,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromUpload = (schemeID, upload, frameSize) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    const layer = await LayerService.createLayer({
      layer_type: LayerTypes.UPLOAD,
      scheme_id: schemeID,
      upload_id: 0,
      layer_data: JSON.stringify({
        id: upload.id,
        name: upload.file_name.substring(
          upload.file_name.lastIndexOf("uploads/") + "uploads/".length,
          upload.file_name.lastIndexOf(".")
        ),
        rotation: 0,
        flip: 0,
        flop: 0,
        left: frameSize.width / 2,
        top: frameSize.height / 2,
        source_file: upload.file_name,
        preview_file: upload.file_name,
        opacity: 1,
        shadowColor: null,
        shadowBlur: 0,
        shadowOpacity: 1,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: 0,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createTextLayer = (schemeID, textObj, frameSize) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    const layer = await LayerService.createLayer({
      layer_type: LayerTypes.TEXT,
      scheme_id: schemeID,
      upload_id: 0,
      layer_data: JSON.stringify({
        ...textObj,
        name: textObj.text,
        left: frameSize.width / 2,
        top: frameSize.height / 2,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        flop: 0,
        flip: 0,
        shadowColor: null,
        shadowBlur: 0,
        shadowOpacity: 1,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: 0,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
    dispatch(setCurrent(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateLayer = (layer) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  let configuredLayer = {
    ...layer,
    layer_order: layer.layer_order || 1,
  };
  try {
    dispatch(updateListItem(configuredLayer));
    const currentLayer = getState().layerReducer.current;
    if (currentLayer && currentLayer.id === configuredLayer.id) {
      dispatch(setCurrent(configuredLayer));
    }
    await LayerService.updateLayer(configuredLayer.id, {
      ...configuredLayer,
      layer_data: JSON.stringify(configuredLayer.layer_data),
    });
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
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

export const deleteLayer = (layer) => async (dispatch) => {
  // dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(layer));
    dispatch(setCurrent(null));
    await LayerService.deleteLayer(layer.id);
    dispatch(
      setMessage({ message: "Deleted Layer successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};
