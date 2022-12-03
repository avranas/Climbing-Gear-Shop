import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadCartData = async (dispatch) => {
  const response = await axios("/authenticated");
  if (response.data) {
    dispatch(getCartFromServer());
  } else {
    dispatch(getCartFromLocalStorage());
  }
};

export const changeQuantityInGuestCart = (cartItem, newQuantity) => {
  let guestCart = JSON.parse(localStorage.getItem("guestCart"));
  if (!guestCart) {
    return;
  }
  const foundItem = guestCart.find(i => i.id === cartItem.id);
  foundItem.quantity = newQuantity;
  localStorage.setItem("guestCart", JSON.stringify(guestCart));
}

export const deleteFromGuestCart = (id) => {
  let guestCart = JSON.parse(localStorage.getItem("guestCart"));
  if (!guestCart) {
    return;
  }
  guestCart = guestCart.filter(i => i.id !== id);
  localStorage.setItem("guestCart", JSON.stringify(guestCart));
}


const getCartFromServer = createAsyncThunk(
  "cart/getCartFromServer",
  async () => {
    try {
      const response = await axios.get(`/cart`);
      //loop through data to find the total item count
      const payload = {
        cartItems: [],
        itemCount: 0,
        subTotal: 0
      }
      response.data.forEach(i => {
        payload.itemCount += i.quantity;
        payload.subTotal += (i.quantity * i.product.productOptions[0].price)
      });
      payload.cartItems = response.data;
      return payload;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

const getCartFromLocalStorage = createAsyncThunk(
  "cart/getCartFromLocalStorage",
  async () => {
    try {
      //Since the cart data is not saved on the server, I can't simply
      //fetch the product data with one SQL query. Instead I have to
      //fetch each product individually
      const guestCart = JSON.parse(localStorage.getItem("guestCart"));
      let payload = {
        subTotal: 0,
        itemCount: 0,
        cartItems: []
      }
      if (!guestCart) {
        return payload;
      }
      payload.cartItems = await Promise.all(
        guestCart.map(async (item) => {
          const response = await axios.get(`/product/${item.productId}`);
          const product = response.data.product;
          //find the product option that matches the user's selection
          const foundOption = response.data.productOptions.find(
            (produtOption) => produtOption.option === item.optionSelection
          );
          //The return option has to be set up like this to mimic what
          //the server returns. This will make handling the data easier
          const newProduct = {
            id: product.id,
            optionType: product.optionType,
            productName: product.productName,
            brandName: product.brandName,
            smallImageFile1: product.smallImageFile1,
            productOptions: [
              {
                price: foundOption.price,
                amountInStock: foundOption.amountInStock
              },
            ],
          };
          payload.itemCount += Number(item.quantity);
          payload.subTotal += Number(newProduct.productOptions[0].price * item.quantity);
          return {
            id: item.id,
            quantity: item.quantity,
            optionSelection: item.optionSelection,
            product: newProduct
          };
        })
      );
      return payload;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: {
      cartItems: [],
      itemCount: -1,
      subTotal: 0,
    },
    isLoading: false,
    hasError: false
  },
  reducers: {
  },
  extraReducers: {
    [getCartFromServer.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [getCartFromServer.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [getCartFromServer.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [getCartFromLocalStorage.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [getCartFromLocalStorage.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [getCartFromLocalStorage.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  },
});

export const selectCart = (state) => state.cart;
export default cartSlice.reducer;
