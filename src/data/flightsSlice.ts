import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { modifyFilters, type FlightsFilters } from "./classes/filters";

export interface FlightsState {
  highlightedAirportId?: number;
  highlightedRouteKey?: string;
  flightsListScrollPosition: number;

  filters?: FlightsFilters;
}

const initialState: FlightsState = {
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
  flightsListScrollPosition: 0,
  filters: undefined,
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

    // Scroll position
    recordFlightsListScrollPosition(
      state: FlightsState,
      action: PayloadAction<number>,
    ) {
      state.flightsListScrollPosition = action.payload;
    },

    // Used for logout
    clearAllUIFlightData(state: FlightsState) {
      state.flightsListScrollPosition = 0;
      state.filters = undefined;
    },

    // filters
    updateFilters(
      state: FlightsState,
      action: PayloadAction<Partial<FlightsFilters>>,
    ) {
      state.filters = modifyFilters(state.filters, action.payload);
    },
  },
});

export const {
  recordHighlightedAirport,
  recordHighlightedRoute,
  clearHighlights,

  recordFlightsListScrollPosition,

  clearAllUIFlightData,
  updateFilters,
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
