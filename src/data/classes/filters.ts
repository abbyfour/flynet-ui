import type { Flight } from "./flights/Flight";

export interface FlightsFilters {
  upcoming?: true | false | undefined;
  year?: number | undefined;
}

export function flightFilter(
  filters: FlightsFilters | undefined,
): (flight: Flight) => boolean {
  return (flight: Flight) => {
    if (!filters) return true;

    let pass = true;

    // Upcoming filter
    if (filters.upcoming === true && !flight.upcoming) {
      pass = false;
    } else if (filters.upcoming === false && flight.upcoming) {
      pass = false;
    }

    // Year filter
    if (filters.year !== undefined) {
      const flightYear = flight.date?.getFullYear();

      if (flightYear !== filters.year) {
        pass = false;
      }
    }

    return pass;
  };
}

export function modifyFilters(
  filters: FlightsFilters | undefined,
  value: Partial<FlightsFilters>,
): FlightsFilters {
  return {
    ...filters,
    ...value,
  };
}
