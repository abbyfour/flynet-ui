import { Aircraft, type APIAircraft } from "@data/classes/flights/Aircraft";
import { Airline, type APIAirline } from "@data/classes/flights/Airline";
import { Airport, type APIAirport } from "@data/classes/flights/Airport";
import type { APIFlight } from "@data/classes/flights/Flight";
import type {
  APIFlightLog,
  APIUsernameFlightLog,
} from "@data/classes/flights/FlightLog";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  compareAircraftByYear,
  compareAirlinesByActivity,
  compareAirportsBySize,
} from "@util/flights";
import { baseFlynetQuery } from "../client";
import type { AddFlightRequestBody, EditFlightRequestBody } from "./types";

const limit = 50;

enum FlightsApiTags {
  Flights = "Flights",
}

export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: baseFlynetQuery(),
  tagTypes: [FlightsApiTags.Flights],
  endpoints: (build) => ({
    getFlights: build.query<APIFlightLog, void>({
      queryFn: async (_, __, _extraOptions, baseQuery) => {
        const offset = 0;
        let allItems: APIFlight[] = [];
        let total = 0;
        let message = "";

        try {
          // Fetch first page to get total count
          const firstPageResult = await baseQuery(
            `flight_logs/?limit=${limit}&offset=${offset}`,
          );

          if (firstPageResult.error) {
            return { error: firstPageResult.error };
          }

          const firstPageData = firstPageResult.data as APIFlightLog;
          total = firstPageData.total;
          allItems = [...firstPageData.items];
          message = firstPageData.message;

          // Calculate how many more pages to fetch
          const totalPages = Math.ceil(total / limit);

          // Fetch remaining pages in parallel
          if (totalPages > 1) {
            const pagePromises = [];
            for (let page = 1; page < totalPages; page++) {
              const pageOffset = page * limit;
              pagePromises.push(
                baseQuery(`flight_logs/?limit=${limit}&offset=${pageOffset}`),
              );
            }

            const pageResults = await Promise.all(pagePromises);

            // Combine all items from all pages
            pageResults.forEach((result) => {
              if (!result.error) {
                const pageData = result.data as APIFlightLog;
                allItems = [...allItems, ...pageData.items];
              }
            });
          }

          return {
            data: {
              message,
              total,
              items: allItems,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error,
            },
          };
        }
      },
      providesTags: [FlightsApiTags.Flights],
      keepUnusedDataFor: 300,
    }),

    getUserFlights: build.query<APIFlightLog, string>({
      query: (username) => ({
        url: `user/flight_logs/${encodeURIComponent(username)}`,
        method: "GET",
      }),
      transformResponse: (response: APIUsernameFlightLog) => {
        return {
          message: "",
          total: response.length,
          items: response,
        };
      },
      keepUnusedDataFor: 300,
    }),

    getAirportByCode: build.query<Airport | undefined, string>({
      query: (code) => `airport/code/${code.toUpperCase()}`,
      transformResponse: (response: APIAirport) => {
        return response ? new Airport(response) : undefined;
      },
    }),

    searchAirports: build.query<Airport[], string>({
      query: (query) => `airport/?query=${query}`,
      transformResponse: (response: { items: APIAirport[] }) => {
        if (response) {
          return response.items
            .map((airport) => new Airport(airport))
            .sort((a, b) => compareAirportsBySize(a.type, b.type));
        }
        return [];
      },
    }),

    searchAircraft: build.query<Aircraft[], string>({
      query: (query) => `aircraft/?query=${query}`,
      transformResponse: (response: { items: APIAircraft[] }) => {
        if (response) {
          return response.items
            .map((aircraft) => new Aircraft(aircraft))
            .sort(compareAircraftByYear);
        }
        return [];
      },
    }),

    getAircraftByCode: build.query<Aircraft | undefined, string>({
      query: (code) => `aircraft/code/${code.toUpperCase()}`,
      transformResponse: (response: APIAircraft) => {
        return response ? new Aircraft(response) : undefined;
      },
    }),

    searchAirline: build.query<Airline[], string>({
      query: (query) => `airline/?query=${query}`,
      transformResponse: (response: { items: APIAirline[] }) => {
        if (response) {
          return response.items
            .map((airline) => new Airline(airline))
            .sort(compareAirlinesByActivity);
        }
        return [];
      },
    }),

    getAirlineByCode: build.query<Airline | undefined, string>({
      query: (code) => `airline/code/${code.toUpperCase()}`,
      transformResponse: (response: APIAirline) => {
        return response ? new Airline(response) : undefined;
      },
    }),

    addFlight: build.mutation<void, AddFlightRequestBody>({
      query: (newFlight) => ({
        url: "flight_logs/",
        method: "POST",
        body: newFlight,
      }),
      invalidatesTags: [FlightsApiTags.Flights],
    }),

    deleteFlight: build.mutation<void, number>({
      query: (flightId) => ({
        url: `flight_logs/${flightId}`,
        method: "DELETE",
      }),
      invalidatesTags: [FlightsApiTags.Flights],
    }),

    updateFlight: build.mutation<
      void,
      { flightId: number; updatedData: EditFlightRequestBody }
    >({
      query: ({ flightId, updatedData }) => ({
        url: `flight_logs/${flightId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: [FlightsApiTags.Flights],
    }),
  }),
});

export const {
  useGetFlightsQuery,
  useGetUserFlightsQuery,
  useLazyGetFlightsQuery,
  useLazyGetAirportByCodeQuery,
  useLazySearchAirportsQuery,
  useLazySearchAircraftQuery,
  useLazyGetAircraftByCodeQuery,
  useLazySearchAirlineQuery,
  useLazyGetAirlineByCodeQuery,
  useAddFlightMutation,
  useDeleteFlightMutation,
  useUpdateFlightMutation,
} = flightsApi;

export const clearFlightsCache = () => flightsApi.util.resetApiState();
