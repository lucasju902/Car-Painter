import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import UploadService from "services/uploadService";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  list: [],
  current: null,
  loading: false,
  initialized: false,
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
      state.initialized = true;
    },
    setIntialized: (state, action) => {
      state.initialized = action.payload;
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
    deleteListItem: (state, action) => {
      let list = [...state.list];
      let foundIndex = list.findIndex((item) => item.id === action.payload.id);
      if (foundIndex !== -1) {
        list.splice(foundIndex, 1);
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
  deleteListItem,
  setIntialized,
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

export const uploadFiles = (userID, schemeID, files, callback) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    let formData = new FormData();
    formData.append("userID", userID);
    formData.append("schemeID", schemeID);
    let fileNames = [];
    let newNames = {};
    for (let file of files) {
      fileNames.push(file.name);

      let newName = file.name;
      const firstDotPosition = file.name.indexOf(".");
      if (firstDotPosition !== -1) {
        newName =
          userID +
          "_" +
          file.name.slice(0, firstDotPosition) +
          "." +
          uuidv4() +
          file.name.slice(firstDotPosition);
      }
      newNames[file.name] = newName;
    }
    formData.append("fileNames", JSON.stringify(fileNames));
    formData.append("newNames", JSON.stringify(newNames));
    for (let file of files) formData.append("files", file);

    const uploads = await UploadService.uploadFiles(formData);
    dispatch(concatList(uploads));
    dispatch(
      setMessage({
        message: `Uploaded ${files.length} ${
          files.length > 1 ? "files" : "file"
        } successfully!`,
        type: "success",
      })
    );
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const deleteUpload = (upload, deleteFromAll) => async (dispatch) => {
  // dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(upload));
    await UploadService.deleteUpload(upload.id, deleteFromAll);
    dispatch(
      setMessage({
        message: "Deleted your uploaded file successfully!",
        type: "success",
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  // dispatch(setLoading(false));
};

export default slice.reducer;
