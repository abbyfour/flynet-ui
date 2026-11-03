import { LocationModule, type RouteDefinition } from "../Location";

const SOCIAL_SEGMENT = "social";

export const socialRoute: RouteDefinition<LocationModule.Social> = {
  module: LocationModule.Social,

  parse(pathname) {
    return pathname === `/${SOCIAL_SEGMENT}`
      ? { module: LocationModule.Social }
      : undefined;
  },

  build() {
    return { pathname: `/${SOCIAL_SEGMENT}` };
  },
};
