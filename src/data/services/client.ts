import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { RootState } from "../store";

export const baseFlynetQuery = () =>
  fetchBaseQuery({
    baseUrl: "https://flynet.bumblesquash.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.currentUser?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
