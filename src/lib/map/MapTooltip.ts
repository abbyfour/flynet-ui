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
    return `${object.airport.name} (${object.airport.displayCode})\n(${object.flights.length} flight${object.flights.length !== 1 ? "s" : ""})\n${displayRoutesForAirport(object)}`;
  }

  if (object && "route" in object) {
    return `${displayRouteName(object.route)}\n${displayFlightsOnRoute(object.flights)}`;
  }

  return null;
}

function displayRouteName(route: Route): string {
  return `${route.origin.displayCode} ↔ ${route.destination.displayCode}`;
}

function displayFlightsOnRoute(flights: GroupedFlightDetails[]): string {
  return (
    `(${flights.length} flight${flights.length !== 1 ? "s" : ""})\n` +
    uniquify(
      flights
        .filter((f) => !!f.flightNumber)
        .map((flight) => `  • ${flight.flightNumber}`),
    )
      .sort()
      .join("\n")
  );
}

function displayRoutesForAirport(airport: GroupedAirport): string {
  const routes = new Set<string>();

  for (const flight of airport.flights) {
    if (flight.route.origin.id === airport.airport.id) {
      routes.add(`  • to ${flight.route.destination.displayCode}`);
    } else {
      routes.add(`  • from ${flight.route.origin.displayCode}`);
    }
  }

  if (routes.size > 10) {
    return `  • ${Array.from(routes).filter((r) => r.startsWith("  • to")).length} outgoing routes\n  • ${Array.from(routes).filter((r) => r.startsWith("  • from")).length} incoming routes`;
  }

  return Array.from(routes).sort().join("\n");
}
