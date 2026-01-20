import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum MapProjection {
  Globe = "globe",
  Mercator = "mercator",
}

export enum SidepanelWindows {
  Friends = "friends",
  Settings = "settings",
  Profile = "profile",
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
      action: PayloadAction<SidepanelWindows | undefined>,
    ) {
      state.activeSidepanelWindow = action.payload;
    },
  },
});

export const { setMapProjection, setActiveSidepanelWindow } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
