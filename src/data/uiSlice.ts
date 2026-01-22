import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { AppTheme, MapProjection, type SidepanelWindows } from "./classes/ui";

export interface UIState {
  mapProjection: MapProjection;
  activeSidepanelWindow?: SidepanelWindows;
  theme: AppTheme;
}

const initialState: UIState = {
  mapProjection: MapProjection.Mercator,
  activeSidepanelWindow: undefined,
  theme: AppTheme.Light,
};

export const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["mapProjection", "activeSidepanelWindow", "theme"],
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

    setTheme(state: UIState, action: PayloadAction<AppTheme>) {
      state.theme = action.payload;
    },
  },
});

export const {
  setMapProjection,
  setActiveSidepanelWindow,
  closeActiveSidepanelWindow,
  setTheme,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
