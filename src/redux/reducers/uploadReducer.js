import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import UploadService from "services/uploadService";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "uploadReducer",
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
      let list = [...state.list];
      let foundIndex = list.findIndex((item) => item.id === action.payload.id);
      if (foundIndex !== -1) {
        list[foundIndex] = action.payload;
        state.list = list;
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
  concatList,
  insertToList,
  updateListItem,
} = slice.actions;

export const getUploadListByUserID = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const uploads = await UploadService.getUploadListByUserID(userID);
    dispatch(setList(uploads));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const uploadFiles = (userID, schemeID, files) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let formData = new FormData();
    formData.append("userID", userID);
    formData.append("schemeID", schemeID);
    let fileNames = [];
    for (let file of files) {
      formData.append("files", file);
      fileNames.push(file.name);
    }
    formData.append("fileNames", JSON.stringify(fileNames));

    const uploads = await UploadService.uploadFiles(formData);
    dispatch(concatList(uploads));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
