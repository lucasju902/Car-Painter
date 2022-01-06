import { createSlice } from "@reduxjs/toolkit";
import CarService from "services/carService";
import { setMessage } from "./messageReducer";

const initialState = {
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "carReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
  },
});

const { setLoading } = slice.actions;
export const { setCurrent } = slice.actions;

export const getActiveCar = (userID, carMakeID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const activeCar = await CarService.getActiveCar(userID, carMakeID);
    dispatch(setCurrent(activeCar));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
