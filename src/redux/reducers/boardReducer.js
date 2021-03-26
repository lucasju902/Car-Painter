import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  frameSize: {
    width: 700,
    height: 500,
  },
  paintingGuides: ["car-mask"],
  zoom: 1,
};

export const slice = createSlice({
  name: "boardReducer",
  initialState,
  reducers: {
    setFrameSize: (state, action) => {
      state.frameSize = action.payload;
    },
    setFrameSizeToMax: (state, action) => {
      let size = action.payload;
      let originSize = state.frameSize;
      state.frameSize = {
        width: Math.max(size.width, originSize.width),
        height: Math.max(size.height, originSize.height),
      };
    },

    setPaintingGuides: (state, action) => {
      state.paintingGuides = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
  },
});

export const {
  setFrameSize,
  setFrameSizeToMax,
  setPaintingGuides,
  setZoom,
} = slice.actions;

export default slice.reducer;
