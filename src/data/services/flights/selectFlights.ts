import { createSelector } from "@reduxjs/toolkit";
import type { Airport } from "../../classes/flights/Airport";
import { Flight } from "../../classes/flights/Flight";
import { Route } from "../../classes/flights/Route";
import { flightsApi } from "./flightsAPI";

export type GroupedFlightDetails = {
  id: number;
  flightNumber?: string;
  flightId?: number;
  route: Route;
};

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
  selectFlightsAsObjects,
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

      byRoute
        .get(flight.route.key)!
        .flights.push(flight.asGroupedFlightDetails());
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
  selectFlightsAsObjects,
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

      airportsById
        .get(flight.origin.id)!
        .flights.push(flight.asGroupedFlightDetails());

      if (!airportsById.has(flight.destination.id)) {
        airportsById.set(flight.destination.id, {
          airport: flight.destination,
          flights: [],
        });
      }

      airportsById
        .get(flight.destination.id)!
        .flights.push(flight.asGroupedFlightDetails());
    }

    return Array.from(airportsById.values());
  },
);

/**
 * Selects the currently selected flight object from the Redux store.
 */
export const selectSelectedFlight = createSelector(
  [selectFlightsAsObjects, (state) => state.ui.selectedFlightId],
  (flights, selectedFlightId) =>
    flights.find((flight) => flight.id === selectedFlightId) || null,
);

function sortFlights(a: Flight, b: Flight) {
  if (!a.date) return 1;
  if (!b.date) return -1;

  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  if (dateA < dateB) return 1;
  if (dateA > dateB) return -1;

  // If dates are equal, compare departure times
  if (a.departureTime === b.departureTime) return 0;
  if (!a.departureTime) return 1;
  if (!b.departureTime) return -1;

  if (a.departureTime < b.departureTime) return 1;
  if (a.departureTime > b.departureTime) return -1;

  return 0;
}
