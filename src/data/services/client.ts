import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { AppRootState } from "../store";

const FLYNET_API_ORIGIN = "https://flynet.bumblesquash.com";

function trimLeadingSlash(path: string) {
  return path.startsWith("/") ? path.slice(1) : path;
}

export const baseFlynetQuery = () =>
  fetchBaseQuery({
    // Use Vite proxy in development to avoid cross-origin/CORS issues.
    baseUrl: import.meta.env.DEV ? "/api/" : `${FLYNET_API_ORIGIN}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppRootState).user.currentUser?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });

export function flynetServerImageUrl(path: string) {
  const cleanPath = trimLeadingSlash(path);
  return import.meta.env.DEV
    ? `/api/${cleanPath}`
    : `${FLYNET_API_ORIGIN}/${cleanPath}`;
}
