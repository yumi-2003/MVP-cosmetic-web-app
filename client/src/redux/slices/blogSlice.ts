import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import type { IBlog } from "../types";

interface BlogState {
  items: IBlog[];
  selectedBlog: IBlog | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogState = {
  items: [],
  selectedBlog: null,
  status: "idle",
  error: null,
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/blogs");
      // The backend returns an object { data, page, limit, total, totalPages }
      return response.data.data || (Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blogs");
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBlogBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blog post");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData: Partial<IBlog>, { rejectWithValue }) => {
    try {
      const response = await api.post("/blogs", blogData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create blog post");
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
