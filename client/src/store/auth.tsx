import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAdmin: false,
  isAuthentificated: false,
};

const authSlice = createSlice({
  name: "authentification",
  initialState: initialAuthState,
  reducers: {
    isAdmin(state) {
      state.isAdmin = true;
    },
    isUser(state) {
      state.isAdmin = false;
    },
    login(state) {
      state.isAuthentificated = true;
    },
    logout(state) {
      state.isAuthentificated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
