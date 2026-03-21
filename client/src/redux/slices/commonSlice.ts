import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

interface CommonState {
  newsletterStatus: "idle" | "loading" | "succeeded" | "failed";
  advisorRecommendation: any | null;
  advisorStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommonState = {
  newsletterStatus: "idle",
  advisorRecommendation: null,
  advisorStatus: "idle",
  error: null,
};

export const subscribeNewsletter = createAsyncThunk(
  "common/subscribeNewsletter",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/newsletter/subscribe", { email });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Subscription failed");
    }
  }
);

export const getSkinAdvisorRecommendation = createAsyncThunk(
  "common/getSkinRecommendation",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/skinAdvisor/recommendation", data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to get recommendation");
    }
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    resetNewsletterStatus: (state) => {
      state.newsletterStatus = "idle";
    },
    resetAdvisor: (state) => {
      state.advisorRecommendation = null;
      state.advisorStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.newsletterStatus = "loading";
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.newsletterStatus = "succeeded";
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.newsletterStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(getSkinAdvisorRecommendation.pending, (state) => {
        state.advisorStatus = "loading";
      })
      .addCase(getSkinAdvisorRecommendation.fulfilled, (state, action) => {
        state.advisorStatus = "succeeded";
        state.advisorRecommendation = action.payload;
      })
      .addCase(getSkinAdvisorRecommendation.rejected, (state, action) => {
        state.advisorStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetNewsletterStatus, resetAdvisor } = commonSlice.actions;
export default commonSlice.reducer;
