import { LocationModule, type RouteDefinition } from "../Location";

const SETTINGS_SEGMENT = "settings";

export const settingsRoute: RouteDefinition<LocationModule.Settings> = {
  module: LocationModule.Settings,

  parse(pathname) {
    return pathname === `/${SETTINGS_SEGMENT}`
      ? { module: LocationModule.Settings }
      : undefined;
  },

  build() {
    return { pathname: `/${SETTINGS_SEGMENT}` };
  },
};
