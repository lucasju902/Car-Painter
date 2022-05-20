import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import BlockedUserService from "services/blockedUserService";
import CookieService from "services/cookieService";
import { setMessage } from "./messageReducer";
import {
  clearCurrent as clearCurrentScheme,
  clearList as clearSchemeList,
  clearSharedList,
  clearFavoriteList,
} from "./schemeReducer";
import { setIntialized } from "./uploadReducer";

const initialState = {
  user: undefined,
  loading: false,
  previousPath: null,
  blockedUsers: [],
  blockedBy: [],
};

export const slice = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
    setBlockedUsers: (state, action) => {
      state.blockedUsers = action.payload;
    },
    setBlockedBy: (state, action) => {
      state.blockedBy = action.payload;
    },
  },
});

const { setUser, setLoading, setBlockedUsers, setBlockedBy } = slice.actions;
export const { setPreviousPath } = slice.actions;

export const signInWithCookie = (callback, fallback) => async (dispatch) => {
  const siteLogin = CookieService.getSiteLogin();
  if (siteLogin && Object.keys(siteLogin).length === 2) {
    dispatch(setLoading(true));

    try {
      const user = await AuthService.getMe();
      dispatch(setBlockedUsers(user.blockedUsers.map((item) => item.userid)));
      dispatch(
        setBlockedBy(user.blockedByUsers.map((item) => item.blocker_id))
      );
      dispatch(setUser(_.omit(user, ["blockedUsers", "blockedByUsers"])));
      if (callback) callback();
    } catch (error) {
      dispatch(setMessage({ message: error.response.data.message }));
      if (fallback) fallback(error.response.data.message);
    }
    dispatch(setLoading(false));
  } else {
    if (fallback) fallback();
  }
};

export const signIn = (payload, callback) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.signIn(payload);
    CookieService.setSiteLogin(response.token);
    dispatch(setUser(response.user));
    if (callback) callback(response.user);
  } catch (error) {
    dispatch(setMessage({ message: error.response.data.message }));
  }
  dispatch(setLoading(false));
};

export const signOut = () => async (dispatch) => {
  CookieService.clearSiteLogin();
  dispatch(clearSchemeList());
  dispatch(clearCurrentScheme());
  dispatch(clearSharedList());
  dispatch(clearFavoriteList());
  dispatch(setUser(null));
  dispatch(setIntialized(false));
};

export const getBlockedUsers = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const blockedUserList = await BlockedUserService.getBlockedUserListByBlocker(
      userID
    );
    dispatch(setBlockedUsers(blockedUserList.map((item) => item.userid)));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getBlockedBy = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const blockedUserList = await BlockedUserService.getBlockedUserListByBlockedUser(
      userID
    );
    dispatch(setBlockedBy(blockedUserList.map((item) => item.blocker_id)));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
