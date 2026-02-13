import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trending: [],
};

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    setTrending: (state, action) => {
      state.trending = action.payload;
    },
  },
});

export const { setTrending, clearTrending } = trendingSlice.actions;
export default trendingSlice.reducer;
