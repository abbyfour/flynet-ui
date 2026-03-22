import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TailsManifest {
  airlines: TailAirline[];
}
export interface TailAirline {
  name: string;
  folder: string;
  alternateNames: string[];
  tails: AirlineTailSpec[];
  wikipedia: string;
}

export interface AirlineTailSpec {
  id: number;
  file: string;
  description?: string;
}

export const tailsApi = createApi({
  reducerPath: "tailsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tails.ab4.ca" }),
  endpoints: (builder) => ({
    getTailsManifest: builder.query<TailsManifest, void>({
      query: () => "/tails.json",
      // 1 hour cache time, since the manifest doesn't change often and we want to minimize requests
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetTailsManifestQuery } = tailsApi;

export function getAirlineTailURL(
  airline: TailAirline,
  tailSpec: AirlineTailSpec,
): string {
  return `https://tails.ab4.ca/src/${airline.folder}/${tailSpec.file}`;
}
