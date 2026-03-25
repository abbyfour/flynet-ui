export type InProgressDraft =
  | { type: "new" }
  | { type: "edit"; flightId: number };

export type Selected =
  | {
      type: "flight";
      flightId: number;
    }
  | { type: "route"; routeKey: string }
  | { type: "airport"; airportId: number }
  | { type: "airline"; airlineId: string };
