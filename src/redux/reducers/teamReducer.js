import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import TeamService from "services/teamService";

const initialState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "teamReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
      state.initialized = true;
    },
  },
});

export const { setLoading, setList } = slice.actions;

export const getTeamListByUserID = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const teams = await TeamService.getTeamListByUserID(userID);
    dispatch(setList(teams));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
