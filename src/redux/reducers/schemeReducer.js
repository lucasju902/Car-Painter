import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import { HistoryActions } from "constant";
import { parseScheme } from "helper";
import SchemeService from "services/schemeService";
import SharedSchemeService from "services/sharedSchemeService";
import { setMessage } from "./messageReducer";
import { setCurrent as setCurrentCarMake } from "./carMakeReducer";
import { setList as setLayerList, setLoadedStatusAll } from "./layerReducer";
import { setList as setBasePaintList } from "./basePaintReducer";
import { pushToActionHistory } from "./boardReducer";

const initialState = {
  list: [],
  sharedList: [],
  sharedUsers: [],
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
    clearList: (state) => {
      state.list = [];
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
    setSharedList: (state, action) => {
      state.sharedList = [...action.payload];
    },
    updateSharedListItem: (state, action) => {
      let sharedList = [...state.sharedList];
      let foundIndex = sharedList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        sharedList[foundIndex] = action.payload;
        state.sharedList = sharedList;
      }
    },
    deleteSharedListItem: (state, action) => {
      state.sharedList = state.sharedList.filter(
        (item) => item.id !== action.payload
      );
    },
    clearSharedList: (state) => {
      state.sharedList = [];
    },
    setSharedUsers: (state, action) => {
      state.sharedUsers = [...action.payload];
    },
    updateSharedUser: (state, action) => {
      let sharedUsers = [...state.sharedUsers];
      let foundIndex = sharedUsers.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        sharedUsers[foundIndex] = action.payload;
        state.sharedUsers = sharedUsers;
      }
    },
    insertToSharedUsers: (state, action) => {
      let sharedUser = { ...action.payload };
      state.sharedUsers.push(sharedUser);
    },
    deleteSharedUser: (state, action) => {
      state.sharedUsers = state.sharedUsers.filter(
        (item) => item.id !== action.payload
      );
    },
    clearSharedUsers: (state) => {
      state.sharedUsers = [];
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
  setSharedList,
  updateSharedListItem,
  deleteSharedListItem,
  setSharedUsers,
  updateSharedUser,
  deleteSharedUser,
  insertToSharedUsers,
} = slice.actions;
export const {
  setSaving,
  setLoaded,
  setCurrent,
  clearCurrent,
  clearList,
  clearSharedList,
  clearSharedUsers,
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

export const createScheme = (
  carMake,
  name,
  userID,
  legacy_mode = 0,
  onOpen = null
) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const scheme = await SchemeService.createScheme(
      carMake.id,
      name,
      userID,
      legacy_mode
    );
    dispatch(insertToList(scheme));
    if (onOpen) onOpen(scheme.id);
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getScheme = (schemeID, callback) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await SchemeService.getScheme(schemeID);
    console.log("result: ", result);
    let scheme = await SchemeService.updateScheme(schemeID, {
      ..._.omit(result.scheme, ["carMake", "layers", "sharedUsers"]),
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
    if (callback) callback(scheme, result.sharedUsers);
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

export const getSharedUsers = (schemeID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const sharedUsers = await SharedSchemeService.getSharedSchemeListBySchemeID(
      schemeID
    );
    dispatch(setSharedUsers(sharedUsers));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateSharedUserItem = (id, payload, callback) => async (
  dispatch
) => {
  try {
    const shared = await SharedSchemeService.updateSharedScheme(id, payload);
    dispatch(updateSharedUser(shared));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const deleteSharedUserItem = (id, callback) => async (dispatch) => {
  try {
    await SharedSchemeService.deleteSharedScheme(id);
    dispatch(deleteSharedUser(id));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const getSharedList = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const list = await SharedSchemeService.getSharedSchemeListByUserID(userID);
    dispatch(setSharedList(list));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateSharedItem = (id, payload, callback, fallback) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const shared = await SharedSchemeService.updateSharedScheme(id, payload);
    dispatch(updateSharedListItem(shared));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
    if (fallback) fallback();
  }
  dispatch(setLoading(false));
};

export const deleteSharedItem = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await SharedSchemeService.deleteSharedScheme(id);
    dispatch(deleteSharedListItem(id));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const createSharedUser = (payload, callback) => async (dispatch) => {
  try {
    console.log("payload: ", payload);
    let sharedUser = await SharedSchemeService.createSharedScheme(payload);
    dispatch(insertToSharedUsers(sharedUser));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export default slice.reducer;
