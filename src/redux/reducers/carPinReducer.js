import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import CarPinService from "services/carPinService";

const initialState = {
  list: [],
  loading: false,
  updatingID: -1,
};

export const slice = createSlice({
  name: "carPinReducer",
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
    deleteListItem: (state, action) => {
      let pinList = [...state.list];
      let foundIndex = pinList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        pinList.splice(foundIndex, 1);
        state.list = pinList;
      }
    },
    setUpdatingID: (state, action) => {
      state.updatingID = action.payload;
    },
  },
});

export const {
  setLoading,
  setList,
  insertToList,
  deleteListItem,
  setUpdatingID,
} = slice.actions;

export const getCarPinListByUserID = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const carPinList = await CarPinService.getCarPinListByUserID(userID);
    dispatch(setList(carPinList));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createCarPin = (carMakeID) => async (dispatch, getState) => {
  dispatch(setUpdatingID(carMakeID));
  try {
    const currentUser = getState().authReducer.user;
    const newCarPin = await CarPinService.createCarPin({
      car_make: carMakeID,
      userid: currentUser.id,
    });

    dispatch(insertToList(newCarPin));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setUpdatingID(-1));
};

export const deleteCarPin = (carMakeID) => async (dispatch, getState) => {
  dispatch(setUpdatingID(carMakeID));
  try {
    const carPinList = getState().carPinReducer.list;
    const carPin = carPinList.find((item) => item.car_make === carMakeID);
    if (carPin) {
      await CarPinService.deleteCarPin(carPin.id);
      dispatch(deleteListItem(carPin));
    }
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setUpdatingID(-1));
};

export default slice.reducer;
