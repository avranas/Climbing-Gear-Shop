import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadProduct = createAsyncThunk(
  "product/loadProduct",
  async (productID) => {
    try {
      const response = await axios.get(`/product/${productID}`);
      const data = response.data;
      const payload = {
        brandName: data.brandName,
        categoryName: data.categoryName,
        description: data.description,
        largeImageFile: data.largeImageFile,
        price: data.price,
        productName: data.productName
      }
      return payload;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: {
      brandName: '',
      categoryName: '',
      description: '',
      largeImageFile: '',
      price: '',
      productName: '',
      isLoading: true,
      hasError: false
    }
  },
  extraReducers: {
    [loadProduct.pending]: (state, action) => {
      state.product.isLoading = true;
      state.product.hasError = false;
    },
    [loadProduct.fulfilled]: (state, action) => {
      state.product = action.payload;
      //console.log(JSON.parse(JSON.stringify(state)));
      state.product.isLoading = false;
      state.product.hasError = false;
    },
    [loadProduct.rejected]: (state, action) => {
      state.product.isLoading = false;
      state.product.hasError = true;
    }
  },
});

export const selectProduct = (state) => state.product.product;
export default productSlice.reducer;