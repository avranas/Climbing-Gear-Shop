import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadCartData = async (dispatch) => {
  const response = await axios('/authenticated');
  if (response.data){
    dispatch(getCartFromServer());
  } else {
    dispatch({type: 'cart/getCartFromLocalStorage'})
  }
}

const getCartFromServer = createAsyncThunk(
  "cart/getCartFromServer",
  async () => {
    try {
      console.log('loading cart from server')
      const response = await axios.get(`/cart`);
      return response.data
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

//TODO sync up localstorage.guestCart and the cartSlice.
//Whenever you update localStorage, the slice must be updated too

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cartItems: []
    }
  },
  reducers:{
    getCartFromLocalStorage(state, action){
      const guestCart = JSON.parse(localStorage.getItem('guestCart'));
      if (!guestCart) {
        state.cart.cartItems = []
      } else {
        state.cart.cartItems = guestCart
      }
      console.log(state.cart.cartItems)
    },
    addToGuestCart(state, action){
      const newCartItem = action.payload;
      state.cart.cartItems.push(newCartItem);
      //localStorage can only accept strings, so I have to use this workaround
      //where I save stringified arrays, then retrieve the strings, and parse
      //them into JSON
      let cart = JSON.parse(localStorage.getItem('guestCart'));
      if (!cart) {
        const newArray = [];
        newArray.push(newCartItem);
        localStorage.setItem('guestCart', JSON.stringify(newArray));
      } else {
        //Remove duplicates, and update with newer quantity
        cart = cart.filter(i => 
          i.productId !== newCartItem.productId ||
          i.optionSelection !== newCartItem.optionSelection
        );
        cart.push(newCartItem);
        localStorage.setItem('guestCart', JSON.stringify(cart));
      }
    }

  },
  extraReducers: {
    [getCartFromServer.pending]: (state, action) => {
      state.cart.isLoading = true;
      state.cart.hasError = false;
    },
    [getCartFromServer.fulfilled]: (state, action) => {
      console.log(action.payload)
      state.cart.cartItems = action.payload;
      state.cart.isLoading = false;
      state.cart.hasError = false;
    },
    [getCartFromServer.rejected]: (state, action) => {
      state.cart.isLoading = false;
      state.cart.hasError = true;
    }
  },
});

export const selectCart = (state) => state.cart.cart;
export default cartSlice.reducer;