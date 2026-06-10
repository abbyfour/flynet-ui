import { flightFilter } from "@data/classes/filters";
import type { Airport } from "@data/classes/flights/Airport";
import { Flight } from "@data/classes/flights/Flight";
import { Route } from "@data/classes/flights/Route";
import type { AppRootState } from "@data/store";
import { createSelector } from "@reduxjs/toolkit";
import { compareTimes } from "@util/types";
import { flightsApi } from "./flightsAPI";

export type GroupedFlightDetails = Flight;

const selectFlightsResult = flightsApi.endpoints.getFlights.select();

const selectFlights = createSelector(
  selectFlightsResult,
  (result) => result?.data?.items,
);

/**
 * Selects flights from the Redux store and transforms them into instances of the Flight class. If there are no flights, it returns an empty array.
 */
export const selectFlightsAsObjects = createSelector(selectFlights, (flights) =>
  (flights ? flights.map((flight) => new Flight(flight)) : []).sort(
    sortFlights,
  ),
);

export const selectFilteredFlights = createSelector(
  [selectFlightsAsObjects, (state: AppRootState) => state.flights.filters],
  (flights, filters) => {
    if (!filters) return flights;

    return flights.filter(flightFilter(filters));
  },
);

/**
 * Groups flights by their route (origin-destination pair). Each group contains the route and an array of flights that take that route.
 */
export type GroupedRoute = {
  route: Route;
  flights: GroupedFlightDetails[];
};

/**
 * Selects and groups flights by their route (origin-destination pair). Each group contains the route and an array of flights that take that route.
 */
export const selectRoutesFromFlights = createSelector(
  selectFilteredFlights,
  (flights): GroupedRoute[] => {
    if (!flights.length) return [];

    const byRoute = new Map<string, GroupedRoute>();

    for (const flight of flights) {
      if (!byRoute.has(flight.route.key)) {
        byRoute.set(flight.route.key, {
          route: flight.route,
          flights: [],
        });
      }

      byRoute.get(flight.route.key)!.flights.push(flight);
    }

    return Array.from(byRoute.values());
  },
);

/**
 * Groups flights by their associated airports (both origin and destination). Each group contains the airport and an array of flight details for flights that either depart from or arrive at that airport.
 */
export type GroupedAirport = {
  airport: Airport;
  flights: GroupedFlightDetails[];
};

/**
 * Selects and groups flights by their associated airports (both origin and destination). Each group contains the airport and an array of flight details for flights that either depart from or arrive at that airport.
 */
export const selectAirportsFromFlights = createSelector(
  selectFilteredFlights,
  (flights): GroupedAirport[] => {
    if (!flights.length) return [];

    const airportsById = new Map<number, GroupedAirport>();

    for (const flight of flights) {
      if (!airportsById.has(flight.origin.id)) {
        airportsById.set(flight.origin.id, {
          airport: flight.origin,
          flights: [],
        });
      }

      airportsById.get(flight.origin.id)!.flights.push(flight);

      if (!airportsById.has(flight.destination.id)) {
        airportsById.set(flight.destination.id, {
          airport: flight.destination,
          flights: [],
        });
      }

      airportsById.get(flight.destination.id)!.flights.push(flight);
    }

    return Array.from(airportsById.values());
  },
);

/**
 * Selects the currently selected flight object from the Redux store.
 */
export const selectSelectedFlights = createSelector(
  [selectFlightsAsObjects, (state: AppRootState) => state.flights.selected],
  (flights, selection) =>
    selection?.type === "flight"
      ? flights.filter((flight) => flight.id === selection.flightId)
      : selection?.type === "route"
        ? flights.filter((flight) => flight.route.key === selection.routeKey)
        : selection?.type === "airport"
          ? flights.filter(
              (flight) =>
                flight.origin.id === selection.airportId ||
                flight.destination.id === selection.airportId,
            )
          : selection?.type === "airline"
            ? flights.filter(
                (flight) => flight?.airline?.name === selection.airlineId,
              )
            : selection?.type === "plane"
              ? flights.filter(
                  (flight) => flight?.plane?.model === selection.planeId,
                )
              : selection?.type === "registration"
                ? flights.filter(
                    (flight) =>
                      flight?.plane?.registration === selection.registration,
                  )
                : null,
);

export function sortFlights(a: Flight, b: Flight) {
  if (!a.date && !b.date) return 0;

  if (!a.date) return 1;
  if (!b.date) return -1;

  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  if (dateA < dateB) return 1;
  if (dateA > dateB) return -1;

  // If dates are equal, compare departure times
  return (compareTimes(a.departureTime, b.departureTime) || 0) * -1; // Multiply by -1 to sort in descending order
}
