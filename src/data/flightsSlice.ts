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
  selectionContext?: Extract<Selected, { type: "route" | "airport" }>;
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

    setSelected(
      state: FlightsState,
      action: PayloadAction<Selected | undefined>,
    ) {
      if (action.payload?.type === "flight") {
        if (
          state.selected?.type === "route" ||
          state.selected?.type === "airport"
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
      state.selectionContext = undefined;
      state.inProgressDraft = undefined;
      state.flightsListScrollPosition = 0;
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
  updateDraftingFlight,

  recordFlightsListScrollPosition,

  clearAllUIFlightData,
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
