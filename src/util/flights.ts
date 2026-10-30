import type { Aircraft } from "@data/classes/flights/Aircraft";
import type { Airline } from "@data/classes/flights/Airline";
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
    case "closed":
      return "Closed";
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

export function compareAirportsBySize(a: AirportType, b: AirportType) {
  const sizeOrder = [
    "large_airport",
    "medium_airport",
    "small_airport",
    "seaplane_base",
    "heliport",
    "closed",
  ];
  return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
}

export function compareAircraftByYear(a: Aircraft, b: Aircraft) {
  const yearA = a.yearIntroduced ?? 0;
  const yearB = b.yearIntroduced ?? 0;
  return yearB - yearA;
}

export function compareAirlinesByActivity(a: Airline, b: Airline) {
  // compare by activity (active airlines first) and then name alphabetically
  const activityA = a.isActive ? 1 : 0;
  const activityB = b.isActive ? 1 : 0;
  if (activityB - activityA !== 0) {
    return activityB - activityA;
  }
  return a.name.localeCompare(b.name);
}
