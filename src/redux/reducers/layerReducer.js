import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import LayerService from "services/layerService";
import _ from "lodash";
import { LayerTypes } from "../../constants";

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
      state.current = action.payload;
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

export const createLayersFromBasePaint = (schemeID, base, order) => async (
  dispatch
) => {
  dispatch(setLoading(true));

  try {
    let layer_order = order;
    for (let base_item of base.base_data) {
      const layer = await LayerService.createLayer({
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        upload_id: 0,
        layer_data: JSON.stringify({
          ...base_item,
          id: base.id,
        }),
        layer_visible: 1,
        layer_locked: 0,
        layer_order: layer_order++,
        time_modified: 0,
        confirm: "",
      });
      dispatch(insertToList(layer));
    }
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromShape = (
  schemeID,
  shape,
  order,
  frameSize
) => async (dispatch) => {
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
        color: shape.color,
        left: 0,
        top: frameSize.height / 2,
        source_file: shape.overlay_file,
        preview_file: shape.overlay_thumb,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: order,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromLogo = (schemeID, logo, order, frameSize) => async (
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
        left: 0,
        top: frameSize.height / 2,
        source_file: logo.source_file,
        preview_file: logo.preview_file,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: order,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createLayerFromUpload = (
  schemeID,
  upload,
  order,
  frameSize
) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const layer = await LayerService.createLayer({
      layer_type: LayerTypes.UPLOAD,
      scheme_id: schemeID,
      upload_id: 0,
      layer_data: JSON.stringify({
        id: upload.id,
        name: upload.file_name.match(/(?<=uploads\/)(.*)(?=\.)/g)[0],
        rotation: 0,
        flip: 0,
        flop: 0,
        left: 0,
        top: frameSize.height / 2,
        source_file: upload.file_name,
        preview_file: upload.file_name,
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: order,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createTextLayer = (schemeID, textObj, order, frameSize) => async (
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
      }),
      layer_visible: 1,
      layer_locked: 0,
      layer_order: order,
      time_modified: 0,
      confirm: "",
    });
    dispatch(insertToList(layer));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateLayer = (layer) => async (dispatch) => {
  // dispatch(setLoading(true));

  try {
    dispatch(updateListItem(layer));
    await LayerService.updateLayer(layer.id, {
      ...layer,
      layer_data: JSON.stringify(layer.layer_data),
    });
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};

export const deleteLayer = (layer) => async (dispatch) => {
  // dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(layer));
    await LayerService.deleteLayer(layer.id);
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};
