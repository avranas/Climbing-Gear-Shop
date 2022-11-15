import { createSlice } from "@reduxjs/toolkit";

const newestCartItemSlice = createSlice({
  name: "newestCartItem",
  initialState: {
    newestCartItem: {
      productId: 0,
      optionSelection: '',
      quantity: 0
    }
  },
  reducers: {
    setNewestCartItem(state, action) {
      state.newestCartItem = action.payload;
    }
  }
});

export const selectNewestCartItem = (state) => state.newestCartItem.newestCartItem;
export const { setNewestCartItem } = newestCartItemSlice.actions;
export default newestCartItemSlice.reducer;