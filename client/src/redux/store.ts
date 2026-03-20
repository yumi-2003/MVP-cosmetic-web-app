import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
// Import other reducers here as you create them
// import authReducer from "./slices/authSlice";
// import cartReducer from "./slices/cartSlice";

/**
 * Configure Redux Store
 * 
 * configureStore automatically sets up Redux Thunk middleware 
 * and connects with the Redux DevTools extension for debugging.
 */
export const store = configureStore({
  reducer: {
    products: productReducer,
    // auth: authReducer,
    // cart: cartReducer,
  },
  // Adding custom middleware if needed
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiMiddleware),
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
