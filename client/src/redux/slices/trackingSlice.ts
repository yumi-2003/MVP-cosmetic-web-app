import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export interface TrackingStatusEvent {
  status: string;
  description: string;
  timestamp: string;
}

export interface ITracking {
  _id: string;
  order: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  distanceKm: number;
  status: "pending" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "failed" | "returned";
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  statusHistory: TrackingStatusEvent[];
}

interface TrackingState {
  tracking: ITracking | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TrackingState = {
  tracking: null,
  status: "idle",
  error: null,
};

export const fetchTracking = createAsyncThunk(
  "tracking/fetchTracking",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shipping/${orderId}`);
      return response.data as ITracking;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tracking info");
    }
  }
);

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    clearTracking: (state) => {
      state.tracking = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTracking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tracking = action.payload;
      })
      .addCase(fetchTracking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearTracking } = trackingSlice.actions;
export default trackingSlice.reducer;
