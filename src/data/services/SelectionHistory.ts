const QUEUE_MAX_LENGTH = 10;

export enum SelectionType {
  Flight = "flight",
  Route = "route",
  Airport = "airport",
  Airline = "airline",
  Aircraft = "plane",
  Registration = "registration",
}

export type Selected =
  | {
      type: SelectionType.Flight;
      flightId: number;
    }
  | { type: SelectionType.Route; routeKey: string }
  | { type: SelectionType.Airport; airportId: number }
  | { type: SelectionType.Airline; airlineId: string }
  | { type: SelectionType.Aircraft; planeId: number | string }
  | { type: SelectionType.Registration; registration: string };

export type SelectionHistory = Array<Selected>;

export function addToSelectionHistory(
  queue: SelectionHistory,
  newSelection: Selected,
): SelectionHistory {
  if (queue.length > QUEUE_MAX_LENGTH) {
    return [...queue.slice(1), newSelection];
  }

  return [...queue, newSelection];
}

export function popFromSelectionHistory(
  queue: SelectionHistory | undefined,
): [Selected | undefined, SelectionHistory] {
  if (!queue || queue.length === 0) {
    return [undefined, []];
  }

  const selection = queue[queue.length - 1];
  const rest = queue.slice(0, -1);

  return [selection, rest];
}
