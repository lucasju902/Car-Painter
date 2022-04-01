import { createSlice } from "@reduxjs/toolkit";
import DownloaderService from "services/downloaderService";
import { setMessage } from "./messageReducer";

const initialState = {
  iracing: null,
  loading: false,
  simPreviewing: false,
  askingSimPreviewByLatest: false,
};

export const slice = createSlice({
  name: "downloaderReducer",
  initialState,
  reducers: {
    setIracing: (state, action) => {
      state.iracing = action.payload;
    },
    setDownloading: (state, action) => {
      state.loading = action.payload;
    },
    setSimPreviewing: (state, action) => {
      state.simPreviewing = action.payload;
    },
    setAskingSimPreviewByLatest: (state, action) => {
      state.askingSimPreviewByLatest = action.payload;
    },
  },
});

export const {
  setIracing,
  setDownloading,
  setSimPreviewing,
  setAskingSimPreviewByLatest,
} = slice.actions;

export const getDownloaderStatus = (onSuccess, onError) => async (
  dispatch,
  getState
) => {
  dispatch(setDownloading(true));
  let downloaderStatus = null;
  try {
    const result = await DownloaderService.getDownloaderStatus();
    if (result) {
      downloaderStatus = result.iracing === "True";
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (onError) {
      onError();
    }
  }
  const iracing = getState().downloaderReducer.iracing;
  if (downloaderStatus !== iracing) {
    dispatch(setIracing(downloaderStatus));
  }
  dispatch(setDownloading(false));
};

export const submitSimPreview = (schemeID, isCustomNumber, payload) => async (
  dispatch
) => {
  dispatch(setSimPreviewing(true));
  try {
    const result = await DownloaderService.submitSimPreview(
      schemeID,
      isCustomNumber,
      payload
    );
    if (result) {
      dispatch(
        setMessage({
          message: "Submitted Sim Preview Successfully!",
          type: "success",
        })
      );
    }
  } catch (err) {
    console.log("Error: ", err);
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setSimPreviewing(false));
};

export default slice.reducer;
