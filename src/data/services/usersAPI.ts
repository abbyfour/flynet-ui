import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  ExtendedUserProperties,
  TokenResponse,
  UserProperties,
} from "../classes/user";
import { baseFlynetQuery } from "./client";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseFlynetQuery(),
  endpoints: (build) => ({
    register: build.mutation<UserProperties, Omit<UserProperties, "id">>({
      query: (userProperties) => ({
        url: "user/register",
        method: "POST",
        body: userProperties,
      }),
    }),

    login: build.mutation<
      TokenResponse,
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "token",
        method: "POST",
        body: new URLSearchParams(credentials),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),

    me: build.query<ExtendedUserProperties, { token: string }>({
      query: ({ token }) => ({
        url: `user/me`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLazyMeQuery } =
  usersApi;
