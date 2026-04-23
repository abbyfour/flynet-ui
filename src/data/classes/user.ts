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
  roleId: number;
  role: {
    id: number;
    slug: string;
    name: string;
  };
  userProfile: {
    id: number;
    bio?: string;
    uiMode?: AppTheme | "system";

    imagePath?: string;
    imageUuid?: string;

    /** @unimplemented */
    theme?: string;
  };
}

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export type UserWithToken<T extends UserProperties = UserProperties> = T & {
  token: string;
};

export function getUserAvatarUrl(user: ExtendedUserProperties): string {
  if (user.userProfile.imagePath) {
    return flynetServerImageUrl(user.userProfile.imagePath);
  }

  return "https://up.quizlet.com/11bmuo-fk839-256s.png";
}
