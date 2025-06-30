import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { API_CONFIG } from "../config/api";
import { apiClient } from "../utils/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

interface AuthState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  loading: boolean;
  error: string | null;
}

// Default values for the auth state
const initialState: AuthState = {
  id: localStorage.getItem("userId") || "",
  firstName: localStorage.getItem("firstName") || "",
  lastName: localStorage.getItem("lastName") || "",
  email: localStorage.getItem("email") || "",
  token: localStorage.getItem("token") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    console.log("🔐 Attempting login with payload:", payload);

    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      payload
    );

    console.log("✅ Login successful, response:", response.data);
    console.log(
      `🎫 Access token: ${response.data.accessToken.substring(0, 50)}...`
    );

    // Store tokens in localStorage for persistence
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("userId", response.data.user.id);
    localStorage.setItem("firstName", response.data.user.firstName);
    localStorage.setItem("lastName", response.data.user.lastName);
    localStorage.setItem("email", response.data.user.email);

    console.log("💾 Stored user data in localStorage");

    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error);

    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || "Login failed";

    console.error("🔍 Error details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: message,
    });

    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    console.log("🔐 Attempting register with payload:", payload);

    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      payload
    );

    console.log("✅ Register successful, response:", response.data);
    console.log(
      `🎫 Access token: ${response.data.accessToken.substring(0, 50)}...`
    );

    // Store tokens in localStorage for persistence
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("userId", response.data.user.id);
    localStorage.setItem("firstName", response.data.user.firstName);
    localStorage.setItem("lastName", response.data.user.lastName);
    localStorage.setItem("email", response.data.user.email);

    console.log("💾 Stored user data in localStorage");

    return response.data;
  } catch (error) {
    console.error("❌ Register failed:", error);

    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || "Registration failed";

    console.error("🔍 Error details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: message,
    });

    return rejectWithValue(message);
  }
});

export const refreshTokens = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: string }
>("auth/refreshTokens", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    // Store new tokens in localStorage
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const message = err.response?.data?.message || "Token refresh failed";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.token = "";
      state.refreshToken = "";
      state.error = null;
      state.loading = false;

      // Clear localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.id = action.payload.user.id;
          state.firstName = action.payload.user.firstName;
          state.lastName = action.payload.user.lastName;
          state.email = action.payload.user.email;
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.loading = false;
          state.error = null;

          // User data is already stored in the loginUser thunk
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload ?? "Login failed";
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.id = action.payload.user.id;
          state.firstName = action.payload.user.firstName;
          state.lastName = action.payload.user.lastName;
          state.email = action.payload.user.email;
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.loading = false;
          state.error = null;

          // User data is already stored in the registerUser thunk
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload ?? "Registration failed";
        state.loading = false;
      })
      .addCase(refreshTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refreshTokens.fulfilled,
        (state, action: PayloadAction<RefreshTokenResponse>) => {
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload ?? "Token refresh failed";
        state.loading = false;
        // Clear all auth data on failed refresh
        state.id = "";
        state.firstName = "";
        state.lastName = "";
        state.email = "";
        state.token = "";
        state.refreshToken = "";

        // Clear localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
