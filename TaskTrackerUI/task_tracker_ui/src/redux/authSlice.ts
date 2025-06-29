import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
}

interface AuthState extends LoginResponse {
  loading: boolean;
  error: string | null;
}

// Default values for the auth state
const initialState: AuthState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  token: "",
  refreshToken: "",
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:5000/api/auth/login",
      payload
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{message:string}>

    const message = err.response?.data?.message || "Login failed";
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
          state.id = action.payload.id;
          state.firstName = action.payload.firstName;
          state.lastName = action.payload.lastName;
          state.email = action.payload.email;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.loading = false;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload ?? "Login failed";
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
