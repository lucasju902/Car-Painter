import { createSlice } from "@reduxjs/toolkit";
import CarService from "services/carService";
import { setMessage } from "./messageReducer";

const initialState = {
  cars: [],
  loading: false,
  submitting: false,
};

export const slice = createSlice({
  name: "carReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action) => {
      state.submitting = action.payload;
    },
    setCars: (state, action) => {
      state.cars = action.payload;
    },
  },
});

const { setLoading, setSubmitting } = slice.actions;
export const { setCars } = slice.actions;

export const getCarRaces = (schemeID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let carRaces = [];
    const stampedCarResult = await CarService.getCarRace(schemeID, 0);
    carRaces.push(stampedCarResult.output);
    const customCarResult = await CarService.getCarRace(schemeID, 1);
    carRaces.push(customCarResult.output);
    dispatch(setCars(carRaces));
  } catch (err) {
    console.log("Error: ", err);
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const setCarRace = (payload, onSuccess) => async (dispatch) => {
  dispatch(setSubmitting(true));
  try {
    const result = await CarService.setCarRace(payload);
    if (result.status != 1) {
      dispatch(setMessage({ message: result.output }));
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.log("Error: ", err);
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setSubmitting(false));
};

export default slice.reducer;
