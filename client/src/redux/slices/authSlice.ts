import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import type { IUser } from "../types";

interface AuthState {
  user: IUser | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  status: "idle",
  error: null,
};

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signUp", userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Sign up failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      
      // If server returns user data directly, we can skip getMe() or use it as a verification
      if (!response.data.user) {
        await dispatch(getMe());
      }
      
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.msg || "Login failed");
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SignUp
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // GetMe
      .addCase(getMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.status = "failed";
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
