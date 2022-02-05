import { createSlice } from "@reduxjs/toolkit";
import CarService from "services/carService";
import { setMessage } from "./messageReducer";
import { updateScheme, setCurrent as setCurrentScheme } from "./schemeReducer";

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

export const getCarRaces = (schemeID, onSuccess, onError) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    let carRaces = [];
    const stampedCarResult = await CarService.getCarRace(schemeID, 0);
    carRaces.push(stampedCarResult.output);
    const customCarResult = await CarService.getCarRace(schemeID, 1);
    carRaces.push(customCarResult.output);
    dispatch(setCars(carRaces));
    dispatch(
      setMessage({ type: "success", message: "Raced car successfully!" })
    );
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.log("Error: ", err);
    dispatch(setMessage({ message: err.message }));
    if (onError) {
      onError();
    }
  }
  dispatch(setLoading(false));
};

export const setCarRace = (payload, onSuccess, onError) => async (
  dispatch,
  getState
) => {
  dispatch(setSubmitting(true));
  try {
    const result = await CarService.setCarRace(payload);
    if (result.status != 1) {
      dispatch(setMessage({ message: result.output }));
    }
    const currentScheme = getState().schemeReducer.current;
    dispatch(
      updateScheme({ id: currentScheme.id, race_updated: 1 }, false, false)
    );
    dispatch(setCurrentScheme({ race_updated: 1 }));
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.log("Error: ", err);
    dispatch(setMessage({ message: err.message }));
    if (onError) {
      onError();
    }
  }
  dispatch(setSubmitting(false));
};

export default slice.reducer;
