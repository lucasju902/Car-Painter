import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import CookieService from "services/cookieService";
import { setMessage } from "./messageReducer";
import {
  clearCurrent as clearCurrentScheme,
  clearList as clearSchemeList,
  clearSharedList,
} from "./schemeReducer";

const initialState = {
  user: undefined,
  loading: false,
  previousPath: null,
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
  },
});

const { setUser, setLoading } = slice.actions;
export const { setPreviousPath } = slice.actions;

export const signInWithCookie = (callback, fallback) => async (dispatch) => {
  const siteLogin = CookieService.getSiteLogin();
  if (siteLogin && Object.keys(siteLogin).length === 2) {
    dispatch(setLoading(true));

    try {
      const user = await AuthService.getMe();
      dispatch(setUser(user));
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
  dispatch(setUser(null));
};

export default slice.reducer;
