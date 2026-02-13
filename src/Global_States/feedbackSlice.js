import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbacks: [],
};

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    setFeedbacks: (state, action) => {
      state.feedbacks = action.payload;
    },
   
  },
});

export const { setFeedbacks, updateFeedbackReply } = feedbackSlice.actions;
export default feedbackSlice.reducer;
