import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import LeagueSeriesService from "services/leagueSeriesService";

const initialState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "leagueSeriesReducer",
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

export const getLeagueSeriesListByUserID = (userID) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const leagueSeries = await LeagueSeriesService.getLeagueSeriesListByUserID(
      userID
    );
    dispatch(setList(leagueSeries));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
