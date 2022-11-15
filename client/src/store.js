import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import productListSlice from './slices/productListSlice';
import notificationSlice from './slices/notificationSlice';
import productSlice from "./slices/productSlice";
import cartSlice from "./slices/cartSlice";
import newestCartItemSlice from "./slices/newestCartItemSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    productList: productListSlice,
    product: productSlice,
    notifications: notificationSlice,
    cart: cartSlice,
    newestCartItem: newestCartItemSlice
  },
});