import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FlightDraft } from "./classes/flights/FlightDraft";

type InProgressDraft = {
  type: "new" | "edit";
  // For editing
  flightId?: number;
  draft: FlightDraft;
};

export type Selected =
  | {
      type: "flight";
      flightId: number;
    }
  | { type: "route"; routeKey: string }
  | { type: "airport"; airportId: number };

export interface FlightsState {
  highlightedAirportId?: number;
  highlightedRouteKey?: string;
  flightsListScrollPosition: number;
  inProgressDraft?: InProgressDraft;

  selected?: Selected;
}

const initialState: FlightsState = {
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
  selected: undefined,
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
    /**
     * @deprecated Use `setSelected({ type: "flight", flightId })` instead for consistency with other selected types
     */
    setSelectedFlight(
      state: FlightsState,
      action: PayloadAction<number | undefined>,
    ) {
      if (action.payload === undefined) {
        state.selected = undefined;
      } else {
        state.selected = { type: "flight", flightId: action.payload };
      }
    },

    setSelected(
      state: FlightsState,
      action: PayloadAction<Selected | undefined>,
    ) {
      state.selected = action.payload;
    },

    clearSelected(state: FlightsState) {
      state.selected = undefined;
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
      state.selected = undefined;
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
  setSelected,
  clearSelected,

  setNewFlight,
  setEditingFlight,
  clearDraftingFlight,
  updateDraftingFlight,

  recordFlightsListScrollPosition,

  clearAllUIFlightData,
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
