import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HTTPStateKind } from "../hooks/use-http";

// interfaces
interface Message {
    success: string | null;
    error: string | null;
}
interface LoadingState {
  statut: HTTPStateKind | null
  message: Message;
}

const initialLoadingState: LoadingState = {
  statut: null,
  message: {
    success: null,
    error: null
  },
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialLoadingState,
  reducers: {
    setStatut(state, action: PayloadAction<HTTPStateKind | null>) {
      state.statut = action.payload;
    },
    setMessage(state, action: PayloadAction<Message>) {
      state.message = action.payload;
    },
    resetStore(state) {
      state.statut = initialLoadingState.statut;
      state.message = initialLoadingState.message;
    }
  },
});

export const loadingActions = loadingSlice.actions;

export default loadingSlice.reducer;
