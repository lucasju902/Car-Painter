import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import UserService from "services/userService";

const initialState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
  },
});

const { setLoading } = slice.actions;
export const { setList } = slice.actions;

export default slice.reducer;

export const getUserList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const users = await UserService.getUserList();
    dispatch(setList(users));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
