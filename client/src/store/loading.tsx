import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HTTPStateKind } from "../global/types";

// interfaces
interface Message {
  pending: string | null;
  success: string | null;
  error: string | null;
}
interface LoadingState {
  statut: HTTPStateKind;
  message: Message;
}

const initialLoadingState: LoadingState = {
  statut: HTTPStateKind.IDLE,
  message: {
    pending: null,
    success: null,
    error: null,
  },
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialLoadingState,
  reducers: {
    setStatut(
      state,
      action: PayloadAction<HTTPStateKind>
    ) {
      state.statut = action.payload;
    },
    setMessage(state, action: PayloadAction<Message>) {
      state.message = action.payload;
    },
    reset(state) {
      state.statut = initialLoadingState.statut;
      state.message = initialLoadingState.message;
    },
  },
});

export const loadingActions = loadingSlice.actions;

export default loadingSlice.reducer;
