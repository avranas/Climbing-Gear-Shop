import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadOrders = createAsyncThunk(
  "ordersList/loadOrders",
  async () => {
    try {
      const response = await axios.get(`/order`);
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
);

const ordersListSlice = createSlice({
  name: "ordersList",
  initialState: {
    data: [],
    isLoading: true,
    hasError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectOrdersList = (state) => state.ordersList;
export default ordersListSlice.reducer;
