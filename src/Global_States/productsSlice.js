import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload; // ✅ array only
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
});

export const { setProducts, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
