import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import type { ICartItem } from "../types";

interface CartState {
  items: ICartItem[];
  totalAmount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  status: "idle",
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data.items;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart/items", item);
      return response.data.items;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add item to cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return response.data.items;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove item from cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (data: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cart/items/${data.productId}`, { quantity: data.quantity });
      return response.data.items;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update item quantity");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        // Total amount calculation could also be handled by backend
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addMatcher(
        (action) => [addToCart.fulfilled, removeFromCart.fulfilled, updateCartItem.fulfilled].includes(action.payload),
        (state, action: PayloadAction<ICartItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
