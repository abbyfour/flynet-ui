import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { modifyFilters, type FlightsFilters } from "./classes/filters";
import type { InProgressDraft, Selected } from "./classes/flightsStateTypes";

export interface FlightsState {
  highlightedAirportId?: number;
  highlightedRouteKey?: string;
  flightsListScrollPosition: number;
  inProgressDraft?: InProgressDraft;

  selected?: Selected;
  selectionContext?: Extract<
    Selected,
    { type: "route" | "airport" | "airline" }
  >;
  filters?: FlightsFilters;
}

const initialState: FlightsState = {
  highlightedAirportId: undefined,
  highlightedRouteKey: undefined,
  selected: undefined,
  inProgressDraft: undefined,
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

    setSelected(
      state: FlightsState,
      action: PayloadAction<Selected | undefined>,
    ) {
      if (action.payload?.type === "flight") {
        if (
          state.selected?.type === "route" ||
          state.selected?.type === "airport" ||
          state.selected?.type === "airline"
        ) {
          state.selectionContext = state.selected;
        }
      } else {
        state.selectionContext = undefined;
      }

      state.selected = action.payload;
    },

    goBackInSelection(state: FlightsState) {
      if (state.selected?.type === "flight" && state.selectionContext) {
        state.selected = state.selectionContext;
        state.selectionContext = undefined;
      } else {
        state.selected = undefined;
        state.selectionContext = undefined;
      }
    },

    // Drafting
    setNewFlight(state: FlightsState) {
      state.inProgressDraft = { type: "new" };
    },

    clearDraftingFlight(state: FlightsState) {
      state.inProgressDraft = undefined;
    },

    setEditingFlight(
      state: FlightsState,
      action: PayloadAction<{ flightId: number } | undefined>,
    ) {
      if (!action.payload) {
        state.inProgressDraft = undefined;
        return;
      }

      const { flightId } = action.payload;
      state.inProgressDraft = { type: "edit", flightId };
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
      state.selectionContext = undefined;
      state.inProgressDraft = undefined;
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

  setSelected,
  goBackInSelection,

  setNewFlight,
  setEditingFlight,
  clearDraftingFlight,

  recordFlightsListScrollPosition,

  clearAllUIFlightData,
  updateFilters,
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
