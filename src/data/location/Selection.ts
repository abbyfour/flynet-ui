export enum SelectionType {
  Flight = "flight",
  Route = "route",
  Airport = "airport",
  Airline = "airline",
  Aircraft = "plane",
  Registration = "registration",
}

export type Selection =
  | {
      type: SelectionType.Flight;
      flightId: number;
    }
  | { type: SelectionType.Route; routeKey: string }
  | { type: SelectionType.Airport; airportId: number }
  | { type: SelectionType.Airline; airlineId: number }
  | { type: SelectionType.Aircraft; aircraftId: number }
  | { type: SelectionType.Registration; registration: string };
