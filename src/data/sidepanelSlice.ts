import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SidepanelState {
  title: string;
  onGoBack?: () => void;
}

const initialState: SidepanelState = {
  title: "",
};

const sidepanelSlice = createSlice({
  name: "sidepanel",
  initialState,
  reducers: {
    setSidepanelOptions(state, action: PayloadAction<Partial<SidepanelState>>) {
      Object.assign(state, action.payload);
    },

    clearSidepanelOptions(state) {
      state.title = "";
      state.onGoBack = undefined;
    },
  },
});

export const selectSidepanelOptions = (state: { sidepanel: SidepanelState }) =>
  state.sidepanel;

export const { setSidepanelOptions, clearSidepanelOptions } =
  sidepanelSlice.actions;
export const sidepanelReducer = sidepanelSlice.reducer;
