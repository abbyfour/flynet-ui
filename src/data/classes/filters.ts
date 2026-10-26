import type { Flight } from "./flights/Flight";

export interface FlightsFilters {
  upcoming?: true | false | undefined;
  year?: number | undefined;
  search?: string | undefined;
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

    if (pass && filters.search) {
      pass = matchesSearch(flight, filters.search);
    }

    return pass;
  };
}

function matchesSearch(flight: Flight, search: string): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = [
    flight.airline?.name,
    flight.aircraft?.model,
    flight.aircraft?.registration,
    ...[flight.origin, flight.destination].flatMap((airport) => [
      airport.name,
      airport.city,
      airport.iataCode,
      airport.icaoCode,
      airport.localCode,
      airport.isoCountry,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
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
