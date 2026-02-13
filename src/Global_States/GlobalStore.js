import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import productsReducer from "./productsSlice";
import trendingReducer from "./trendingSlice";
import offerReducer from "./offerSlice";
import feedbackReducer from "./feedbackSlice";
import userReducer from "./userSlice";
import adminsReducer from "./adminsSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    products: productsReducer,
    trending: trendingReducer,
    offers: offerReducer,
    feedbacks: feedbackReducer,
    users: userReducer,
    admins: adminsReducer,
  },
});
