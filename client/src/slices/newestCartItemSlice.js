import { createSlice } from "@reduxjs/toolkit";

const newestCartItemSlice = createSlice({
  name: "newestCartItem",
  initialState: {
    data: {
      productId: 0,
      optionSelection: '',
      quantity: 0
    }
  },
  reducers: {
    setNewestCartItem(state, action) {
      state.data = action.payload;
    }
  }
});

export const selectNewestCartItem = (state) => state.newestCartItem.data;
export const { setNewestCartItem } = newestCartItemSlice.actions;
export default newestCartItemSlice.reducer;