import { joinPathSegments } from "@util/urlUtil";
import { LocationModule, type RouteDefinition } from "../Location";

const PROFILE_SEGMENT = "profile";
const EDIT_SEGMENT = "edit";

/**
 * Whose profile is shown comes from the entry's scope, so these paths are
 * the same for everyone: /profile, /profile/edit (the core adds /@user).
 */
export const profileRoute: RouteDefinition<LocationModule.Profile> = {
  module: LocationModule.Profile,

  parse(pathname) {
    const [head, second, ...rest] = pathname.split("/").filter(Boolean);

    if (head !== PROFILE_SEGMENT || rest.length > 0) {
      return undefined;
    }

    if (second === undefined) {
      return { module: LocationModule.Profile };
    }

    return second === EDIT_SEGMENT
      ? { module: LocationModule.Profile, editing: true }
      : undefined;
  },

  build({ editing }) {
    return {
      pathname: editing
        ? joinPathSegments(PROFILE_SEGMENT, EDIT_SEGMENT)
        : joinPathSegments(PROFILE_SEGMENT),
    };
  },

  parent({ editing }) {
    return editing ? { module: LocationModule.Profile } : undefined;
  },
};
