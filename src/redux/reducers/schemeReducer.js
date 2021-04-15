import { createSlice } from "@reduxjs/toolkit";
import SchemeService from "services/schemeService";
import { setMessage } from "./messageReducer";
import { setCurrent as setCurrentCarMake } from "./carMakeReducer";
import { setList as setLayerList } from "./layerReducer";
import { setList as setBasePaintList } from "./basePaintReducer";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "schemeReducer",
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
    setCurrentName: (state, action) => {
      state.current = {
        ...state.current,
        name: action.payload,
      };
    },
    setCurrentBaseColor: (state, action) => {
      state.current = {
        ...state.current,
        base_color: action.payload,
      };
    },
  },
});

const { setLoading, setList, insertToList, updateListItem } = slice.actions;
export const {
  setCurrent,
  setCurrentName,
  setCurrentBaseColor,
} = slice.actions;

export const getSchemeList = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const schemes = await SchemeService.getSchemeListByUserID(userID);
    dispatch(setList(schemes));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createScheme = (carMake, name, userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await SchemeService.createScheme(carMake.id, name, userID);
    console.log("result: ", result);
    dispatch(setCurrent(result.scheme));
    dispatch(setCurrentCarMake(result.carMake));
    dispatch(setLayerList(result.layers));
    dispatch(setBasePaintList(result.basePaints));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getScheme = (schemeID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await SchemeService.getScheme(schemeID);
    console.log("result: ", result);
    dispatch(setCurrent(result.scheme));
    dispatch(setCurrentCarMake(result.carMake));
    dispatch(setLayerList(result.layers));
    dispatch(setBasePaintList(result.basePaints));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateScheme = (id, payload) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const scheme = await SchemeService.updateScheme(id, payload);
    dispatch(updateListItem(scheme));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const changeName = (id, name) => async (dispatch) => {
  try {
    await SchemeService.updateScheme(id, { name });
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const changeBaseColor = (id, color) => async (dispatch) => {
  try {
    let base_color = color;
    if (base_color !== "transparent") {
      base_color = base_color.replace("#", "");
    }
    await SchemeService.updateScheme(id, { base_color });
    dispatch(setCurrentBaseColor(base_color));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export default slice.reducer;
