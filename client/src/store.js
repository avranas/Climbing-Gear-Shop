import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import productListSlice from './slices/productListSlice';
import notificationSlice from './slices/notificationSlice';
import productSlice from "./slices/productSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    productList: productListSlice,
    product: productSlice,
    notifications: notificationSlice
  },
});