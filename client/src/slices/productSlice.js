import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadProduct = createAsyncThunk(
  "product/loadProduct",
  async (productID) => {
    try {
      const response = await axios.get(`/product/${productID}`);
      const product = response.data.product;
      const productOptions = response.data.productOptions;
      let lowestPrice = Infinity;
      let highestPrice = 0;
      productOptions.forEach((e) => {
        if (e.price < lowestPrice) {
          lowestPrice = e.price;
        }
        if (e.price > highestPrice) {
          highestPrice = e.price;
        }
      });
      const payload = {
        id: productID,
        brandName: product.brandName,
        categoryName: product.categoryName,
        description: product.description,
        optionType: product.optionType,
        smallImageFile1: product.smallImageFile1,
        largeImageFile: product.largeImageFile,
        productName: product.productName,
        productOptions: productOptions,
        highestPrice: highestPrice,
        lowestPrice: lowestPrice,
      };
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
    data: {
      brandName: "",
      categoryName: "",
      description: "",
      optionType: "",
      smallImageFile1: "",
      largeImageFile: "",
      productName: "",
      lowestPrice: 0,
      highestPrice: 0,
      productOptions: [],
    },
    isLoading: true,
    hasError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProduct.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(loadProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectProduct = (state) => state.product;
export default productSlice.reducer;
