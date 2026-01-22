export interface UserProperties {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ExtendedUserProperties extends UserProperties {
  lastLogin?: string;
  loginCount: number;
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

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
}

export type UserWithToken<T extends UserProperties = UserProperties> = T & {
  token: string;
  tokenDetails: Omit<TokenResponse, "access_token">;
  role: UserRole;
};
