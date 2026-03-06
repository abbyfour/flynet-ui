import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import type { Coordinates } from "../util/mapUtil";
import type { NewFlightProperties } from "./classes/flights/NewFlightProperties";
import { AppTheme, MapProjection, type SidepanelWindows } from "./classes/ui";

export interface UIState {
  mapProjection: MapProjection;
  activeSidepanelWindow?: SidepanelWindows;
  theme: AppTheme;
  mapPosition?: Coordinates;

  highlightedAirportId?: number;
  highlightedRouteKey?: string;

  selectedFlightId?: number;
  newFlight?: NewFlightProperties;
  flightsListScrollPosition: number;
}

const initialState: UIState = {
  mapProjection: MapProjection.Mercator,
  activeSidepanelWindow: undefined,
  theme: AppTheme.Light,
  mapPosition: undefined,
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
  selectedFlightId: undefined,
  flightsListScrollPosition: 0,
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

    // Highlighted map elements
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

    // Selected entities
    setSelectedFlight(
      state: UIState,
      action: PayloadAction<number | undefined>,
    ) {
      state.selectedFlightId = action.payload;
    },

    clearSelectedFlight(state: UIState) {
      state.selectedFlightId = undefined;
    },

    openNewFlightForm(state: UIState) {
      state.newFlight = {};
    },

    setNewFlight(
      state: UIState,
      action: PayloadAction<NewFlightProperties | undefined>,
    ) {
      state.newFlight = action.payload;
    },

    clearNewFlight(state: UIState) {
      state.newFlight = undefined;
    },

    recordFlightsListScrollPosition(
      state: UIState,
      action: PayloadAction<number>,
    ) {
      state.flightsListScrollPosition = action.payload;
    },

    clearAllUIFlightData(state: UIState) {
      state.selectedFlightId = undefined;
      state.newFlight = undefined;
      state.flightsListScrollPosition = 0;
    },
  },
});

export const {
  setActiveSidepanelWindow,
  closeActiveSidepanelWindow,

  setTheme,
  setMapProjection,
  recordMapPosition,

  recordHighlightedAirport,
  recordHighlightedRoute,
  clearHighlights,

  setSelectedFlight,
  clearSelectedFlight,

  openNewFlightForm,
  setNewFlight,
  clearNewFlight,

  recordFlightsListScrollPosition,

  clearAllUIFlightData,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
