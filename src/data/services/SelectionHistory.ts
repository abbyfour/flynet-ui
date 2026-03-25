const QUEUE_MAX_LENGTH = 10;

export type Selected =
  | {
      type: "flight";
      flightId: number;
    }
  | { type: "route"; routeKey: string }
  | { type: "airport"; airportId: number }
  | { type: "airline"; airlineId: string };

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
