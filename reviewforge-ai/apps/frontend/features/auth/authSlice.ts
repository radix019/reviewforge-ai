import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state: AuthState, action: PayloadAction<{ user: User }>) => {
      console.log("action", action);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    authCheckComplete: (state) => {
      state.isLoading = false;
    },
  },
});

export const { loginSuccess, logout, authCheckComplete } = authSlice.actions;
export default authSlice.reducer;
