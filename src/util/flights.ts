import type { AirportType } from "../data/classes/flights/Airport";
import type { Flight } from "../data/classes/flights/Flight";

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
