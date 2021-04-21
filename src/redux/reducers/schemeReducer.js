import _ from "lodash";
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
      let list = action.payload;
      for (let item of list) {
        if (typeof item.guide_data === "string" || !item.guide_data) {
          item.guide_data = JSON.parse(item.guide_data) || {};
        }
      }
      state.list = list;
    },
    insertToList: (state, action) => {
      let scheme = action.payload;
      if (
        scheme &&
        (typeof scheme.guide_data === "string" || !scheme.guide_data)
      ) {
        scheme.guide_data = JSON.parse(scheme.guide_data) || {};
      }
      state.list.push(scheme);
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
      let scheme = action.payload;
      if (
        scheme &&
        (typeof scheme.guide_data === "string" || !scheme.guide_data)
      ) {
        scheme.guide_data = JSON.parse(scheme.guide_data) || {};
      }
      state.current = scheme;
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

export const updateScheme = (payload) => async (dispatch, getState) => {
  try {
    const currentScheme = getState().schemeReducer.current;
    if (currentScheme && currentScheme.id === payload.id) {
      dispatch(setCurrent(payload));
    }

    const scheme = await SchemeService.updateScheme(payload.id, {
      ..._.omit(payload, ["carMake", "layers"]),
      guide_data: JSON.stringify(payload.guide_data),
    });
    dispatch(updateListItem(scheme));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
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
