import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import type { IProduct } from "../types";

export interface FavoriteState {
  items: IProduct[];
  itemIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FavoriteState = {
  items: [],
  itemIds: [],
  status: "idle",
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue("Not logged in");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.get("/users/favorites", config);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch favorites"
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (product: IProduct, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue("Not logged in");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      const response = await api.post(`/users/favorites/${product._id}`, {}, config);
      return { product, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle favorite"
      );
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.itemIds = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.itemIds = state.items.map((item: any) => item._id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { product, message } = action.payload;
        if (message === "Product added to favorites") {
          if (!state.itemIds.includes(product._id)) {
            state.itemIds.push(product._id);
            state.items.push(product);
          }
        } else if (message === "Product removed from favorites") {
          state.itemIds = state.itemIds.filter((id) => id !== product._id);
          state.items = state.items.filter((item) => item._id !== product._id);
        }
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
