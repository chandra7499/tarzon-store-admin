import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offers: [],
};

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    setOffers: (state, action) => {
      state.offers = action.payload;
    },
  },
});

export const { setOffers, clearOffers } = offerSlice.actions;
export default offerSlice.reducer;
