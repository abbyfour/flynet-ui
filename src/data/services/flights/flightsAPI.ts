import { createApi } from "@reduxjs/toolkit/query/react";
import type { APIFlightLog } from "../../classes/flights/FlightLog";
import { baseFlynetQuery } from "../client";

export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: baseFlynetQuery(),
  endpoints: (build) => ({
    getFlights: build.query<APIFlightLog, void>({
      query: () => ({
        url: "flight_logs/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFlightsQuery } = flightsApi;
