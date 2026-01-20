import { createApi } from "@reduxjs/toolkit/query";

// TODO: Implement API connection
export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: async () => ({ data: null }),
  endpoints: (builder) => ({
    // getFlights: builder.query<any[], void>({
    //   query: () => "/flights",
    // }),
  }),
});

export const {
  // useGetFlightsQuery,
} = flightsApi;
