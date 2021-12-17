import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import { HistoryActions } from "constant";
import { parseScheme } from "helper";
import SchemeService from "services/schemeService";
import SharedSchemeService from "services/sharedSchemeService";
import FavoriteSchemeService from "services/favoriteSchemeService";
import { setMessage } from "./messageReducer";
import { setCurrent as setCurrentCarMake } from "./carMakeReducer";
import { setList as setLayerList, setLoadedStatusAll } from "./layerReducer";
import { setList as setBasePaintList } from "./basePaintReducer";
import { pushToActionHistory } from "./boardReducer";
import SocketClient from "utils/socketClient";

const initialState = {
  list: [],
  favoriteList: [],
  sharedList: [],
  sharedUsers: [],
  current: null,
  owner: null,
  lastModifier: null,
  loading: false,
  loaded: false,
  saving: false,
};

export const slice = createSlice({
  name: "schemeReducer",
  initialState,
  reducers: {
    reset: (state) => initialState,
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
        let scheme = { ...schemeList[foundIndex], ...action.payload };
        if (
          scheme &&
          (typeof scheme.guide_data === "string" || !scheme.guide_data)
        ) {
          scheme.guide_data = JSON.parse(scheme.guide_data) || {};
        }

        schemeList[foundIndex] = scheme;
        state.list = schemeList;
      }
    },
    deleteListItem: (state, action) => {
      state.list = state.list.filter(
        (item) => item.id !== parseInt(action.payload)
      );
    },
    setFavoriteList: (state, action) => {
      state.favoriteList = [...action.payload];
    },
    insertToFavoriteList: (state, action) => {
      let favorite = { ...action.payload };
      state.favoriteList.push(favorite);
    },
    deleteFavoriteListItem: (state, action) => {
      state.favoriteList = state.favoriteList.filter(
        (item) => item.id !== action.payload
      );
    },
    clearFavoriteList: (state) => {
      state.favoriteList = [];
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
    setOwner: (state, action) => {
      state.owner = action.payload;
    },
    setLastModifier: (state, action) => {
      state.lastModifier = action.payload;
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
  setSharedList,
  setFavoriteList,
  deleteFavoriteListItem,
  updateSharedListItem,
  deleteSharedListItem,
  setSharedUsers,
  updateSharedUser,
  deleteSharedUser,
  insertToSharedUsers,
  insertToFavoriteList,
} = slice.actions;
export const {
  setSaving,
  setLoaded,
  setCurrent,
  setOwner,
  setLastModifier,
  updateListItem,
  deleteListItem,
  clearCurrent,
  clearList,
  clearFavoriteList,
  clearSharedList,
  clearSharedUsers,
  reset,
  setCurrentName,
  setCurrentBaseColor,
} = slice.actions;

export const getSchemeList = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const schemes = await SchemeService.getSchemeListByUserID(userID);
    dispatch(setList(schemes.filter((scheme) => !scheme.carMake.deleted)));
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

export const deleteAndCreateNewCarMakeLayers = (schemeID) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const scheme = await SchemeService.renewCarMakeLayers(schemeID);
    dispatch(setLayerList(scheme.layers));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getScheme = (schemeID, callback, fallback) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await SchemeService.getScheme(schemeID);
    console.log("result: ", result.scheme);
    dispatch(
      setCurrent(
        _.omit(result.scheme, [
          "carMake",
          "layers",
          "sharedUsers",
          "user",
          "lastModifier",
        ])
      )
    );
    dispatch(setOwner(result.scheme.user));
    dispatch(setLastModifier(result.scheme.lastModifier));
    dispatch(setCurrentCarMake(result.carMake));
    let loadedStatuses = {};
    result.layers.map((item) => {
      loadedStatuses[item.id] = false;
    });
    dispatch(setLoadedStatusAll(loadedStatuses));
    dispatch(setLayerList(result.layers));
    dispatch(setBasePaintList(result.basePaints));
    if (callback) callback(result.scheme, result.sharedUsers);
  } catch (err) {
    dispatch(setMessage({ message: "No Project with that ID!" }));
    if (fallback) fallback();
  }
  dispatch(setLoading(false));
};

export const updateScheme = (
  payload,
  pushingToHistory = true,
  update_thumbnail = true
) => async (dispatch, getState) => {
  try {
    const currentScheme = getState().schemeReducer.current;
    const currentUser = getState().authReducer.user;
    let updatedScheme, payloadForSocket;
    payloadForSocket = {
      ...payload,
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: currentUser.id,
    };
    if (currentScheme && currentScheme.id === payload.id) {
      updatedScheme = {
        ...currentScheme,
        ...payloadForSocket,
      };
      if (update_thumbnail) updatedScheme.thumbnail_updated = 0;
      dispatch(setCurrent(updatedScheme));
    } else {
      const schemeList = getState().schemeReducer.list;
      const foundScheme = schemeList.find((item) => item.id === payload.id);
      updatedScheme = {
        ...foundScheme,
        ...payloadForSocket,
      };
    }
    if (payloadForSocket.guide_data) {
      payloadForSocket.guide_data = JSON.stringify(payloadForSocket.guide_data);
    }

    SocketClient.emit("client-update-scheme", {
      data: payloadForSocket,
      socketID: SocketClient.socket.id,
      userID: currentUser.id,
    });

    dispatch(updateListItem(updatedScheme));
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.SCHEME_CHANGE_ACTION,
          prev_data: currentScheme,
          next_data: parseScheme(updatedScheme),
        })
      );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const deleteScheme = (schemeID, callback) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(schemeID));
    await SchemeService.deleteScheme(schemeID);

    if (callback) callback();
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

export const getSharedList = (userID, callback) => async (dispatch) => {
  try {
    const list = await SharedSchemeService.getSharedSchemeListByUserID(userID);
    dispatch(setSharedList(list));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  if (callback) callback();
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

export const getFavoriteList = (userID, callback) => async (dispatch) => {
  try {
    const list = await FavoriteSchemeService.getFavoriteSchemeListByUserID(
      userID
    );
    dispatch(setFavoriteList(list));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  if (callback) callback();
};

export const createFavoriteScheme = (payload, callback) => async (dispatch) => {
  try {
    let favoriteScheme = await FavoriteSchemeService.createFavoriteScheme(
      payload
    );
    dispatch(insertToFavoriteList(favoriteScheme));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const deleteFavoriteItem = (id, callback) => async (dispatch) => {
  try {
    await FavoriteSchemeService.deleteFavoriteScheme(id);
    dispatch(deleteFavoriteListItem(id));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const createSharedUser = (payload, callback) => async (dispatch) => {
  try {
    let sharedUser = await SharedSchemeService.createSharedScheme(payload);
    dispatch(insertToSharedUsers(sharedUser));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export default slice.reducer;
