import { createSlice } from "@reduxjs/toolkit";

const initialMenuState = {
  isOpen: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState: initialMenuState,
  reducers: {
    closeMenu(state) {
      state.isOpen = false;
    },
    openMenu(state) {
      state.isOpen = true;
    },
    toggleMenu(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const menuActions = menuSlice.actions;

export default menuSlice.reducer;
