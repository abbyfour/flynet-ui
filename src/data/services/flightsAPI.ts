import { createApi } from "@reduxjs/toolkit/query/react";
import type { FlightLog } from "../classes/flights";
import { baseFlynetQuery } from "./client";

export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: baseFlynetQuery(),
  endpoints: (build) => ({
    getFlights: build.query<FlightLog, void>({
      query: () => ({
        url: "flight_logs",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFlightsQuery } = flightsApi;
