import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import type { IProduct } from "../types";
import { addReview } from "./reviewSlice";

interface ProductState {
  items: IProduct[];
  selectedProduct: IProduct | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", { params });
      // The backend returns an object { data, page, limit, total, totalPages }
      return response.data.data || response.data.products || (Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        const review = action.payload as { product: string; rating: number };

        const updateProductStats = (product?: IProduct | null) => {
          if (!product || product._id !== review.product) return;

          const nextReviewCount = product.reviewCount + 1;
          const nextRating =
            nextReviewCount === 1
              ? review.rating
              : Math.round(
                  (((product.rating * product.reviewCount) + review.rating) /
                    nextReviewCount) *
                    10
                ) / 10;

          product.reviewCount = nextReviewCount;
          product.rating = nextRating;
        };

        updateProductStats(state.selectedProduct);

        const listProduct = state.items.find((item) => item._id === review.product);
        if (listProduct) {
          updateProductStats(listProduct);
        }
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
