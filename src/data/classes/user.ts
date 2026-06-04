import { flynetServerImageUrl } from "@data/services/client";
import type { AppTheme } from "./ui";

export interface UserProperties {
  id: number;
  username: string;
  nickname?: string;
}

export interface ExtendedUserProperties extends UserProperties {
  isProfilePublic: boolean;
  email?: string;
  bio?: string;
  imagePath?: string;
  imageUuid?: string;

  userSettings: UserSettings;

  roleId: number;
  role: {
    id: number;
    slug: string;
    name: string;
  };
}

export interface UserSettings {
  id: number;
  uiMode: AppTheme | "system";
}

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export type UserWithToken<T extends UserProperties = UserProperties> = T & {
  token: string;
};

export function getUserAvatarUrl(user: ExtendedUserProperties): string {
  if (user.imagePath) {
    return flynetServerImageUrl(user.imagePath);
  }

  return "https://up.quizlet.com/11bmuo-fk839-256s.png";
}
