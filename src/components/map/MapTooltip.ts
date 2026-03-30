import { icons } from "@assets/icons/icons";
import type { Route } from "@data/classes/flights/Route";
import type {
  GroupedAirport,
  GroupedFlightDetails,
  GroupedRoute,
} from "@data/services/flights/selectFlights";
import { uniquify } from "@util/arrayUtil";
import { renderToString } from "react-dom/server";

function baseTooltip(message: string): { html: string; style: object } {
  return {
    html: `<div>${message}</div>`,
    style: {
      fontFamily: "Teachers, sans-serif",
      fontSize: "1rem",
      backgroundColor: "#1a1a2e",
      color: "#ffffff",
      borderRadius: "6px",
      padding: "8px 12px",
      border: "1px solid rgba(255,255,255,0.1)",
      whiteSpace: "pre-line",
    },
  };
}

export function MapTooltip(object?: GroupedAirport | GroupedRoute) {
  if (object && "airport" in object) {
    return baseTooltip(
      `<span style="font-weight: bold;">${object.airport.name}</span> (${object.airport.displayCode})
    <span style="font-style: italic; font-size: 90%;">${object.airport.city}, ${object.airport.isoCountry}</span>
<span style="font-style: italic; font-size: 90%;">${object.flights.length} flight${object.flights.length !== 1 ? "s" : ""}</span>

${displayRoutesForAirport(object)}`,
    );
  }

  if (object && "route" in object) {
    return baseTooltip(
      `<span style="font-weight: bold; display: flex; align-items: center; gap: 0.4em">${displayRouteName(object.route)}</span>\n${displayFlightsOnRoute(object.flights)}`,
    );
  }

  return null;
}

function displayRouteName(route: Route): string {
  return `${route.origin.displayCode} ${renderToString(icons.flights.route(20))} ${route.destination.displayCode}`;
}

function displayFlightsOnRoute(flights: GroupedFlightDetails[]): string {
  const displayedFlights = uniquify(
    flights
      .filter((f) => !!f.flightNumber)
      .map((flight) => `  • ${flight.flightNumber}`),
  );

  return (
    `<span style="font-style: italic; font-size: 90%;">${flights.length} flight${flights.length !== 1 ? "s" : ""}</span>${displayedFlights.length ? "\n\n" : ""}` +
    displayedFlights.sort().join("\n")
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
