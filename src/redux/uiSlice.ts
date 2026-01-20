import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum MapProjection {
  Globe = "globe",
  Mercator = "mercator",
}

export enum SidepanelWindows {
  Flights = "flights",
  Friends = "friends",
  Profile = "profile",
  Settings = "settings",
}

export interface UIState {
  mapProjection: MapProjection;
  activeSidepanelWindow?: SidepanelWindows;
}

const initialState: UIState = {
  mapProjection: MapProjection.Mercator,
  activeSidepanelWindow: undefined,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMapProjection(state: UIState, action: PayloadAction<MapProjection>) {
      state.mapProjection = action.payload;
    },

    setActiveSidepanelWindow(
      state: UIState,
      action: PayloadAction<SidepanelWindows>,
    ) {
      state.activeSidepanelWindow = action.payload;
    },

    closeActiveSidepanelWindow(state: UIState) {
      state.activeSidepanelWindow = undefined;
    },
  },
});

export const {
  setMapProjection,
  setActiveSidepanelWindow,
  closeActiveSidepanelWindow,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
