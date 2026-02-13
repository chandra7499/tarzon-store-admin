import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admins: [],
};

const adminsSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    setAdmins: (state, action) => {
      state.admins = action.payload;
    },
  
  },
});

export const { setAdmins, clearAdmins } = adminsSlice.actions;
export default adminsSlice.reducer;
