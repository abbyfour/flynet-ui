import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FlightDraft } from "./classes/flights/FlightDraft";

type InProgressDraft = {
  type: "new" | "edit";
  // For editing
  flightId?: number;
  draft: FlightDraft;
};

export interface FlightsState {
  highlightedAirportId?: number;
  highlightedRouteKey?: string;

  selectedFlightId?: number;

  inProgressDraft?: InProgressDraft;

  flightsListScrollPosition: number;
}

const initialState: FlightsState = {
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
  selectedFlightId: undefined,
  inProgressDraft: undefined,
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

    // Drafting
    setNewFlight(
      state: FlightsState,
      action: PayloadAction<FlightDraft | undefined>,
    ) {
      if (!action.payload) {
        state.inProgressDraft = undefined;
        return;
      }

      state.inProgressDraft = { type: "new", draft: action.payload };
    },

    clearDraftingFlight(state: FlightsState) {
      state.inProgressDraft = undefined;
    },

    updateDraftingFlight(
      state: FlightsState,
      action: PayloadAction<Partial<FlightDraft>>,
    ) {
      if (!state.inProgressDraft) return;

      state.inProgressDraft = {
        ...state.inProgressDraft,
        draft: {
          ...state.inProgressDraft.draft,
          ...action.payload,
        },
      } as InProgressDraft;
    },

    setEditingFlight(
      state: FlightsState,
      action: PayloadAction<
        { flightId: number; draft: FlightDraft } | undefined
      >,
    ) {
      if (!action.payload) {
        state.inProgressDraft = undefined;
        return;
      }

      const { flightId, draft } = action.payload;
      state.inProgressDraft = { type: "edit", flightId, draft };
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
      state.selectedFlightId = undefined;
      state.inProgressDraft = undefined;
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

  setNewFlight,
  setEditingFlight,
  clearDraftingFlight,
  updateDraftingFlight,

  recordFlightsListScrollPosition,

  clearAllUIFlightData,
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
