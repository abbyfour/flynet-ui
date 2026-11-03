import { LocationModule, type RouteDefinition } from "../Location";

export const homeRoute: RouteDefinition<LocationModule.Home> = {
  module: LocationModule.Home,

  parse(pathname) {
    return pathname === "/" || pathname === ""
      ? { module: LocationModule.Home }
      : undefined;
  },

  build() {
    return { pathname: "/" };
  },
};
