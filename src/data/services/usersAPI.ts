import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  ExtendedUserProperties,
  UserProperties,
  UserWithToken,
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
      UserWithToken<ExtendedUserProperties>,
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: new URLSearchParams(credentials),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = usersApi;
