import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import FontService from "services/fontService";

const initialState = {
  list: [],
  loadedList: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "fontReducer",
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
    setLoadedList: (state, action) => {
      state.loadedList = action.payload;
    },
    insertToLoadedList: (state, action) => {
      state.loadedList = state.loadedList.concat(action.payload);
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
  setLoadedList,
  insertToLoadedList,
} = slice.actions;

export default slice.reducer;

export const getFontList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const fonts = await FontService.getFontList();
    dispatch(setList(fonts));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
