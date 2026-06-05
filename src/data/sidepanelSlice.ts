import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SidepanelState {
  title: string;
  showGoBack: boolean;
  showGoHome: boolean;
  backRequestId: number;
  homeRequestId: number;
}

export type SidepanelHeaderOptions = Pick<
  SidepanelState,
  "title" | "showGoBack" | "showGoHome"
>;

const initialState: SidepanelState = {
  title: "",
  showGoBack: false,
  showGoHome: false,
  backRequestId: 0,
  homeRequestId: 0,
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
      state.showGoBack = false;
      state.showGoHome = false;
    },

    requestSidepanelBack(state) {
      state.backRequestId += 1;
    },

    requestSidepanelHome(state) {
      state.homeRequestId += 1;
    },
  },
});

export const selectSidepanelOptions = (state: { sidepanel: SidepanelState }) =>
  state.sidepanel;

export const {
  setSidepanelOptions,
  clearSidepanelOptions,
  requestSidepanelBack,
  requestSidepanelHome,
} = sidepanelSlice.actions;
export const sidepanelReducer = sidepanelSlice.reducer;
