import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HTTPStateKind } from "../global/types";

interface LoadingState {
  statut: HTTPStateKind;
  message: string;
}

const initialState: LoadingState = {
  statut: "idle",
  message: "",
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setStatut: (state, { payload }: PayloadAction<HTTPStateKind>) => {
      state.statut = payload;
    },
    setMessage: (state, { payload }: PayloadAction<string>) => {
      state.message = payload;
    },
    reset: () => initialState,
  },
});

export const loadingActions = loadingSlice.actions;
export default loadingSlice.reducer;
