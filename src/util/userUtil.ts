import type {
  TokenResponse,
  UserProperties,
  UserWithToken,
} from "../data/classes/user";

export function addTokenToUser<T extends UserProperties>(
  user: T,
  token: TokenResponse,
): UserWithToken<T> {
  return {
    ...user,
    token: token.access_token,
    tokenDetails: {
      token_type: token.token_type,
      role: token.role,
    },
  } as UserWithToken<T>;
}
