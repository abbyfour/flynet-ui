import type { FlightDraft } from "./flights/FlightDraft";

export type InProgressDraft = {
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
