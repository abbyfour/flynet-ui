import type { AirportType } from "@data/classes/flights/Airport";
import type { Flight } from "@data/classes/flights/Flight";

export function displayAirportType(type: AirportType) {
  switch (type) {
    case "large_airport":
      return "Large Airport";
    case "medium_airport":
      return "Medium Airport";
    case "small_airport":
      return "Small Airport";
    case "seaplane_base":
      return "Seaplane Base";
    case "heliport":
      return "Heliport";
    default:
      return type;
  }
}

export function findFlightFromID(
  flights: Flight[],
  id: number | undefined,
): Flight | undefined {
  return id ? flights.find((flight) => flight.id === id) : undefined;
}

export function planespottersLink(reg: string) {
  return `https://www.planespotters.net/search?q=+${reg}`;
}

export function jetphotosLink(reg: string) {
  return `https://www.jetphotos.com/registration/${reg}`;
}

export function flightawareLink(reg: string) {
  return `https://www.flightaware.com/live/flight/${reg}`;
}
