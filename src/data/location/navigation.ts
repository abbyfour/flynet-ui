import { createNavigator } from "./navigator/createNavigator";
import { flightsRoute } from "./locations/flights";
import { homeRoute } from "./locations/home";
import { profileRoute } from "./locations/profile";
import { socialRoute } from "./locations/social";
import { settingsRoute } from "./locations/settings";

/** Register every feature module's route here */
export const routes = [
  homeRoute,
  flightsRoute,
  profileRoute,
  settingsRoute,
  socialRoute,
];

export const navigator = createNavigator({ routes });
