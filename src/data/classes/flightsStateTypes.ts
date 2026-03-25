export type InProgressDraft =
  | { type: "new" }
  | { type: "edit"; flightId: number };
