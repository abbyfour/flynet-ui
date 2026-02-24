import { createApi } from "@reduxjs/toolkit/query/react";
import type { APIFlight } from "../../classes/flights/Flight";
import type { APIFlightLog } from "../../classes/flights/FlightLog";
import { baseFlynetQuery } from "../client";

const limit = 50;

export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: baseFlynetQuery(),
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
    }),
  }),
});

export const { useGetFlightsQuery } = flightsApi;
