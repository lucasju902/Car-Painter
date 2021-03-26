import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
// import BasePaintService from "services/basePaintService";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "basePaintReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      let list = action.payload;
      for (let item of list) {
        if (typeof item.base_data === "string") {
          item.base_data = JSON.parse(item.base_data);
        }
      }
      state.list = list;
    },
    insertToList: (state, action) => {
      let basepaint = action.payload;
      if (typeof basepaint.base_data === "string") {
        basepaint.base_data = JSON.parse(basepaint.base_data);
      }
      state.list.push(basepaint);
    },
    updateListItem: (state, action) => {
      let basePaintList = [...state.list];
      let foundIndex = basePaintList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        basePaintList[foundIndex] = action.payload;
        state.list = basePaintList;
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
  updateListItem,
} = slice.actions;

export default slice.reducer;
