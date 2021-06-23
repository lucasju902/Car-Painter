import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import { HistoryActions } from "constant";
import { parseScheme } from "helper";
import SchemeService from "services/schemeService";
import { setMessage } from "./messageReducer";
import { setCurrent as setCurrentCarMake } from "./carMakeReducer";
import { setList as setLayerList, setLoadedStatusAll } from "./layerReducer";
import { setList as setBasePaintList } from "./basePaintReducer";
import { pushToActionHistory } from "./boardReducer";

const initialState = {
  list: [],
  current: null,
  loading: false,
  loaded: false,
  saving: false,
};

export const slice = createSlice({
  name: "schemeReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSaving: (state, action) => {
      state.saving = action.payload;
    },
    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },
    setList: (state, action) => {
      let list = [...action.payload];
      for (let item of list) {
        if (typeof item.guide_data === "string" || !item.guide_data) {
          item.guide_data = JSON.parse(item.guide_data) || {};
        }
      }
      state.list = list;
    },
    insertToList: (state, action) => {
      let scheme = { ...action.payload };
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
    deleteListItem: (state, action) => {
      state.list = state.list.filter((item) => item.id !== action.payload);
    },
    setCurrent: (state, action) => {
      let scheme = { ...state.current, ...action.payload };
      if (
        scheme &&
        (typeof scheme.guide_data === "string" || !scheme.guide_data)
      ) {
        scheme.guide_data = JSON.parse(scheme.guide_data) || {};
      }
      state.current = scheme;
    },
    clearCurrent: (state, action) => {
      state.current = null;
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

const {
  setLoading,
  setList,
  insertToList,
  updateListItem,
  deleteListItem,
} = slice.actions;
export const {
  setSaving,
  setLoaded,
  setCurrent,
  clearCurrent,
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

export const createScheme = (carMake, name, userID, onOpen) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const result = await SchemeService.createScheme(carMake.id, name, userID);
    console.log("result: ", result);
    if (onOpen) onOpen(result.scheme.id);
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
    let scheme = await SchemeService.updateScheme(schemeID, {
      ..._.omit(result.scheme, ["carMake", "layers"]),
      date_modified: Math.round(new Date().getTime() / 1000),
    });
    dispatch(setCurrent(scheme));
    dispatch(setCurrentCarMake(result.carMake));
    let loadedStatuses = {};
    result.layers.map((item) => {
      loadedStatuses[item.id] = false;
    });
    dispatch(setLoadedStatusAll(loadedStatuses));
    dispatch(setLayerList(result.layers));
    dispatch(setBasePaintList(result.basePaints));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateScheme = (payload, pushingToHistory = true) => async (
  dispatch,
  getState
) => {
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
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.SCHEME_CHANGE_ACTION,
          prev_data: currentScheme,
          next_data: parseScheme(scheme),
        })
      );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const changeName = (id, name) => async (dispatch) => {
  try {
    dispatch(setCurrentName(name));
    await SchemeService.updateScheme(id, { name });
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const changeBaseColor = (id, color) => async (dispatch, getState) => {
  try {
    const currentScheme = getState().schemeReducer.current;
    let base_color = color;
    if (base_color !== "transparent") {
      base_color = base_color.replace("#", "");
    }
    const scheme = await SchemeService.updateScheme(id, { base_color });
    dispatch(setCurrentBaseColor(base_color));
    dispatch(
      pushToActionHistory({
        action: HistoryActions.SCHEME_CHANGE_ACTION,
        prev_data: currentScheme,
        next_data: parseScheme(scheme),
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const deleteScheme = (schemeID) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(schemeID));
    await SchemeService.deleteScheme(schemeID);

    dispatch(
      setMessage({ message: "Deleted Project successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const cloneScheme = (schemeID) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const scheme = await SchemeService.cloneScheme(schemeID);
    dispatch(insertToList(scheme));
    dispatch(
      setMessage({ message: "Cloned Project successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
