import { createSlice } from "@reduxjs/toolkit";
import CarMakeService from "services/carMakeService";
import { setMessage } from "./messageReducer";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "carMakeReducer",
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
    updateListItem: (state, action) => {
      let schemeList = [...state.list];
      let foundIndex = schemeList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        schemeList[foundIndex] = action.payload;
        state.list = schemeList;
      }
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
  },
});

const { setLoading, setList, insertToList, updateListItem } = slice.actions;
export const { setCurrent } = slice.actions;

export const getCarMakeList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const carMakes = await CarMakeService.getCarMakeList();
    dispatch(setList(carMakes));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createCarMake = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const carMake = await CarMakeService.createCarMake(payload);
    dispatch(insertToList(carMake));
    dispatch(setCurrent(carMake));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateCarMake = (id, payload) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const carMake = await CarMakeService.updateCarMake(id, payload);
    dispatch(updateListItem(carMake));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
