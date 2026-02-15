import { createApi } from "@reduxjs/toolkit/query/react";
import type { APIFlightLog } from "../../classes/flights/FlightLog";

// export const flightsApi = createApi({
//   reducerPath: "flightsApi",
//   baseQuery: baseFlynetQuery(),
//   endpoints: (build) => ({
//     getFlights: build.query<FlightLog, void>({
//       query: () => ({
//         url: "flight_logs",
//         method: "GET",
//       }),
//     }),
//   }),
// });

export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: async () => {
    const { mockFlightLog } = await import("../../../mockFlightLog");
    return { data: mockFlightLog };
  },
  endpoints: (build) => ({
    getFlights: build.query<APIFlightLog, void>({
      query: () => ({
        url: "flight_logs",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFlightsQuery } = flightsApi;
