import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadNewestOrder = createAsyncThunk(
  "order/loadNewestOrder",
  async () => {
    try {
      const response = await axios.get(`/order/newest`);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

export const loadOrder = createAsyncThunk(
  "order/loadOrder",
  async (orderId) => {
    try {
      const response = await axios.get(`/order/${orderId}`);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: {
      totalPrice: 0,
      taxCharged: 0,
      subTotal: 0,
      deliveryStreetAddress1: "",
      deliveryStreetAddress2: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryZipCode: "",
      deliveryCountry: "",
      orderStatus: "",
      orderItems: [],
    },
    isLoading: true,
    hasError: false
  },
  extraReducers: {
    [loadOrder.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [loadOrder.fulfilled]: (state, action) => {
      if (action.payload) {
        state.data = action.payload;
      }
      state.isLoading = false;
      state.hasError = false;
    },
    [loadOrder.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [loadNewestOrder.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [loadNewestOrder.fulfilled]: (state, action) => {
      if (action.payload) {
        state.data = action.payload;
      }
      state.isLoading = false;
      state.hasError = false;
    },
    [loadNewestOrder.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    }
  },
});

export const selectOrder = (state) => state.order;
export default orderSlice.reducer;