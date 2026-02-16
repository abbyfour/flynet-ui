import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import type { Coordinates } from "../util/mapUtil";
import { AppTheme, MapProjection, type SidepanelWindows } from "./classes/ui";

export interface UIState {
  mapProjection: MapProjection;
  activeSidepanelWindow?: SidepanelWindows;
  theme: AppTheme;
  mapPosition?: Coordinates;

  highlightedAirportId?: number;
  highlightedRouteKey?: string;
}

const initialState: UIState = {
  mapProjection: MapProjection.Mercator,
  activeSidepanelWindow: undefined,
  theme: AppTheme.Light,
  mapPosition: undefined,
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
};

export const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["mapProjection", "activeSidepanelWindow", "theme", "mapPosition"],
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

    recordMapPosition(state: UIState, action: PayloadAction<Coordinates>) {
      state.mapPosition = action.payload;
    },

    recordHighlightedAirport(
      state: UIState,
      action: PayloadAction<number | undefined>,
    ) {
      state.highlightedAirportId = action.payload;
    },

    recordHighlightedRoute(
      state: UIState,
      action: PayloadAction<string | undefined>,
    ) {
      state.highlightedRouteKey = action.payload;
    },

    clearHighlights(state: UIState) {
      state.highlightedAirportId = undefined;
      state.highlightedRouteKey = undefined;
    },
  },
});

export const {
  setMapProjection,
  setActiveSidepanelWindow,
  closeActiveSidepanelWindow,
  setTheme,
  recordMapPosition,
  recordHighlightedAirport,
  recordHighlightedRoute,
  clearHighlights,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
