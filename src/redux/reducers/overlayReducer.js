import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import OverlayService from "services/overlayService";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "overlayReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    insertToList: (state, action) => {
      state.list.push(action.payload);
    },
    concatList: (state, action) => {
      state.list = state.list.concat(action.payload);
    },
    updateListItem: (state, action) => {
      let overlayList = [...state.list];
      let foundIndex = overlayList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        overlayList[foundIndex] = action.payload;
        state.list = overlayList;
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
} = slice.actions;

export default slice.reducer;

export const getOverlayList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const overlays = await OverlayService.getOverlayList();
    dispatch(setList(overlays));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
