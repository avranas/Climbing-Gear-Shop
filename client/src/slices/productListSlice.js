import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadProductList = createAsyncThunk(
  "productList/loadProducts",
  async (category) => {
    try {
      if (category === '' || category === "all" || category === null) {
        const response = await axios.get('/product');
        return response.data;
      } else {
        //Fetch the product data with the category
        const response = await axios.get(`/category/${category}`);
        return response.data;
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  }
);

const productListSlice = createSlice({
  name: "productList",
  initialState: {
    productList: {
      listOfProducts: [],
      isLoading: true,
      hasError: false,
    },
  },
  reducers: {
    reducers: {
      clearProductList(state, action) {
        state.productList.listOfProducts = [];
      },
    },
  },
  extraReducers: {
    [loadProductList.pending]: (state, action) => {
      state.productList.isLoading = true;
      state.productList.hasError = false;
    },
    [loadProductList.fulfilled]: (state, action) => {
      state.productList.isLoading = false;
      state.productList.hasError = false;
      state.productList.listOfProducts = action.payload;
    },
    [loadProductList.rejected]: (state, action) => {
      state.productList.isLoading = false;
      state.productList.hasError = true;
    },

  },
});

export const selectProductList = (state) => state.productList.productList;
export const { clearProductList } = productListSlice.actions;
export default productListSlice.reducer;