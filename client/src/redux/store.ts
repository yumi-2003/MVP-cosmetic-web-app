import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import orderReducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";
import commonReducer from "./slices/commonSlice";
import trackingReducer from "./slices/trackingSlice";
import favoriteReducer from "./slices/favoriteSlice";

/**
 * Configure Redux Store
 * 
 * configureStore automatically sets up Redux Thunk middleware 
 * and connects with the Redux DevTools extension for debugging.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    orders: orderReducer,
    reviews: reviewReducer,
    common: commonReducer,
    tracking: trackingReducer,
    favorites: favoriteReducer,
  },
});

/**
 * Redux TypeScript Definitions
 * 
 * These types are essential for TypeScript support:
 * - RootState: Represents the entire state tree of the store (useful for useSelector)
 * - AppDispatch: Represents the dispatch function of the store (useful for useDispatch)
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
