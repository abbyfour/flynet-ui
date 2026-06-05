import type {
  ExtendedUserProperties,
  UserProperties,
  UserSettings,
  UserWithToken,
} from "@data/classes/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseFlynetQuery } from "./client";

function dataUrlToBlob(dataUrl: string) {
  const [metadata, base64Data] = dataUrl.split(",");

  if (!metadata || !base64Data) {
    throw new Error("Invalid avatar data URL");
  }

  const mimeType = metadata.match(/data:(.*?);base64/)?.[1];
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], {
    type: mimeType ?? "application/octet-stream",
  });
}

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

    me: build.query<ExtendedUserProperties, void>({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
    }),

    getUserByUsername: build.query<ExtendedUserProperties, string>({
      query: (username) => ({
        url: `user/username/${encodeURIComponent(username)}`,
        method: "GET",
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

    updateUser: build.mutation<
      ExtendedUserProperties,
      Partial<ExtendedUserProperties>
    >({
      query: ({ ...updateData }) => {
        delete updateData["id"];

        return {
          url: `user/me`,
          method: "PUT",
          body: updateData,
        };
      },
    }),

    updateUserAvatar: build.mutation<
      { avatarUrl: string },
      { avatarDataUrl: string }
    >({
      query: ({ avatarDataUrl }) => {
        const formData = new FormData();
        const avatarBlob = dataUrlToBlob(avatarDataUrl);

        formData.append("image", avatarBlob, "avatar.jpg");

        return {
          url: `user/profile_photo`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    updateUserSettings: build.mutation<
      UserSettings,
      Pick<UserSettings, "id" | "uiMode">
    >({
      query: ({ id, ...updateData }) => ({
        url: `user_settings/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLazyMeQuery,
  useGetUserByUsernameQuery,
  useUpdateUserMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserSettingsMutation,
} = usersApi;
