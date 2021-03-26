import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import CookieService from "services/cookieService";
import { setMessage } from "./messageReducer";

const initialState = {
  user: undefined,
  loading: false,
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
  },
});

const { setUser, setLoading } = slice.actions;

export const signInWithCookie = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.signIn(CookieService.getSiteLogin());
    dispatch(
      setUser({
        id: response.id,
        email: response.email,
        name: response.name,
      })
    );
  } catch (error) {
    dispatch(setMessage({ message: error.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
