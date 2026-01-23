export interface UserProperties {
  id: string;
  username: string;
  nickname: string;
}

export interface ExtendedUserProperties extends UserProperties {
  email?: string;
  roleId: number;
  role: {
    id: number;
    slug: string;
    name: string;
  };
}

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export type UserWithToken<T extends UserProperties = UserProperties> = T & {
  token: string;
};
