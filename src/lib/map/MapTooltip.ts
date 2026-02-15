import type { Route } from "../../data/classes/flights/Flight";
import type {
  GroupedAirport,
  GroupedFlightDetails,
  GroupedRoute,
} from "../../data/services/flights/selectFlights";
import { uniquify } from "../../util/arrayUtil";

export function MapTooltip(
  object?: GroupedAirport | GroupedRoute,
): string | null {
  if (object && "airport" in object) {
    return `${object.airport.name} (${object.airport.displayCode})\n${object.flights.length} flight${object.flights.length !== 1 ? "s" : ""}`;
  }

  if (object && "route" in object) {
    console.log(object.flights);
    return `${displayRouteName(object.route)}\n${displayFlightsOnRoute(object.flights)}`;
  }

  return null;
}

function displayRouteName(route: Route): string {
  return `${route.origin.displayCode} → ${route.destination.displayCode}`;
}

function displayFlightsOnRoute(flights: GroupedFlightDetails[]): string {
  return (
    `(${flights.length} flight${flights.length !== 1 ? "s" : ""})\n` +
    uniquify(flights.map((flight) => `  • ${flight.flightNumber ?? flight.id}`))
      .sort()
      .join("\n")
  );
}
