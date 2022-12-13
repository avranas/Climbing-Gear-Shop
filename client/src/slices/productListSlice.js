import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadProductList = createAsyncThunk(
  "productList/loadProducts",
  async ({ category, search }) => {
    try {
      if (category) {
        //Fetch the product data with the category
        const response = await axios.get(`/category/${category}`);
        return response.data;
      } else if (search) {
        const response = await axios.get(`/product/search/${search}`);
        return response.data;
      } else {
        const response = await axios.get("/product");
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
    data: [],
    isLoading: true,
    hasError: false,
  },
  reducers: {
    reducers: {
      clearProductList(state, action) {
        state.data = [];
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        const payload = action.payload;
        //Go through the productOptions in the payload to find the range of
        //prices
        const newProducts = [];
        payload.forEach((product) => {
          let lowestPrice = Infinity;
          let highestPrice = 0;
          product.productOptions.forEach((option) => {
            const price = option.price;
            if (price < lowestPrice) {
              lowestPrice = price;
            }
            if (price > highestPrice) {
              highestPrice = price;
            }
          });
          const newProduct = {
            id: product.id,
            productName: product.productName,
            brandName: product.brandName,
            smallImageFile1: product.smallImageFile1,
            smallImageFile2: product.smallImageFile2,
            lowestPrice: lowestPrice,
            highestPrice: highestPrice,
          };
          newProducts.push(newProduct);
        });
        state.data = newProducts;
      })
      .addCase(loadProductList.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectProductList = (state) => state.productList;
export const { clearProductList } = productListSlice.actions;
export default productListSlice.reducer;
