import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import type { IReview } from "../types";

interface ReviewState {
  productReviews: Record<string, IReview[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReviewState = {
  productReviews: {},
  status: "idle",
  error: null,
};

export const fetchReviewsByProductId = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      return { productId, reviews: response.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (data: { productId: string; rating: number; comment?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/reviews/product/${data.productId}`, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productReviews[action.payload.productId] = action.payload.reviews;
      })
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addReview.pending, (state) => {
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        const review = action.payload;
        if (state.productReviews[review.product]) {
          state.productReviews[review.product].unshift(review);
        } else {
          state.productReviews[review.product] = [review];
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;
