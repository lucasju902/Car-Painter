import { createSlice } from "@reduxjs/toolkit";
import DownloaderService from "services/downloaderService";
import { setMessage } from "./messageReducer";

const initialState = {
  iracing: false,
  simPreviewing: false,
};

export const slice = createSlice({
  name: "downloaderReducer",
  initialState,
  reducers: {
    setIracing: (state, action) => {
      state.iracing = action.payload;
    },
    setSimPreviewing: (state, action) => {
      state.simPreviewing = action.payload;
    },
  },
});

export const { setIracing, setSimPreviewing } = slice.actions;

export const getDownloaderStatus = (onSuccess, onError) => async (dispatch) => {
  try {
    const result = await DownloaderService.getDownloaderStatus();
    if (result) {
      dispatch(setIracing(result.iracing === "True"));
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (onError) {
      onError();
    }
  }
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
