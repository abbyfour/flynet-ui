import { createNavigator } from "./navigator/createNavigator";
import { flightsRoute } from "./locations/flights";
import { homeRoute } from "./locations/home";
import { profileRoute } from "./locations/profile";
import { settingsRoute } from "./locations/settings";

/** Register every feature module's route here */
export const routes = [homeRoute, flightsRoute, profileRoute, settingsRoute];

export const navigator = createNavigator({ routes });
