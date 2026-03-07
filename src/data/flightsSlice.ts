import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NewFlightProperties } from "./classes/flights/NewFlightProperties";

export interface FlightsState {
  highlightedAirportId?: number;
  highlightedRouteKey?: string;

  selectedFlightId?: number;
  newFlight?: NewFlightProperties;
  flightsListScrollPosition: number;
}

const initialState: FlightsState = {
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
  selectedFlightId: undefined,
  newFlight: undefined,
  flightsListScrollPosition: 0,
};

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    // Highlighted map elements
    recordHighlightedAirport(
      state: FlightsState,
      action: PayloadAction<number | undefined>,
    ) {
      state.highlightedAirportId = action.payload;
    },

    recordHighlightedRoute(
      state: FlightsState,
      action: PayloadAction<string | undefined>,
    ) {
      state.highlightedRouteKey = action.payload;
    },

    clearHighlights(state: FlightsState) {
      state.highlightedAirportId = undefined;
      state.highlightedRouteKey = undefined;
    },

    // Selected entities
    setSelectedFlight(
      state: FlightsState,
      action: PayloadAction<number | undefined>,
    ) {
      state.selectedFlightId = action.payload;
    },

    clearSelectedFlight(state: FlightsState) {
      state.selectedFlightId = undefined;
    },

    openNewFlightForm(state: FlightsState) {
      state.newFlight = {};
    },

    setNewFlight(
      state: FlightsState,
      action: PayloadAction<NewFlightProperties | undefined>,
    ) {
      state.newFlight = action.payload;
    },

    clearNewFlight(state: FlightsState) {
      state.newFlight = undefined;
    },

    recordFlightsListScrollPosition(
      state: FlightsState,
      action: PayloadAction<number>,
    ) {
      state.flightsListScrollPosition = action.payload;
    },

    clearAllUIFlightData(state: FlightsState) {
      state.selectedFlightId = undefined;
      state.newFlight = undefined;
      state.flightsListScrollPosition = 0;
    },
  },
});

export const {
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
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
