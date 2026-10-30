import { SidepanelWindows } from "@data/classes/ui";
import type { FlightsState } from "@data/flightsSlice";
import { SelectionType, type Selected } from "@data/services/SelectionHistory";
import {
  decodeURLParam,
  encodeURLParam,
  joinPathSegments,
  parseURLIntParam,
} from "@util/urlUtil";

enum RouteSegment {
  Airport = "airport",
  Airline = "airline",
  Edit = "edit",
  Flight = "flight",
  Flights = "flights",
  New = "new",
  Aircraft = "aircraft",
  Profile = "profile",
  Registration = "registration",
  Route = "route",
  Settings = "settings",
  Social = "social",
}

enum RoutePrefix {
  User = "@",
  Guild = "~",
}

/** Navigation state parsed from a URL */
export type NavigationRouteState = {
  window?: SidepanelWindows;
  selected?: FlightsState["selected"];
  draft?: FlightsState["inProgressDraft"];
  isEditingProfile?: boolean;

  /** Username from a profile-scoped URL, if present */
  viewedProfileUsername?: string;
};

/** App state used to build the URL for the current view */
export type NavigationPathState = {
  activeWindow?: SidepanelWindows;
  selected?: FlightsState["selected"];
  drafting?: FlightsState["inProgressDraft"];
  isEditingProfile?: boolean;

  /** Username of the profile being viewed, if navigating to another profile */
  viewedProfileUsername?: string;

  /** Signed-in username, used when building the current user's profile URL */
  currentUsername?: string;
};

/** Maps a browser pathname to the navigation state it represents */
export function parseNavigationPathname(
  pathname: string,
): NavigationRouteState {
  const [head, second, third] = pathname.split("/").filter(Boolean);

  if (!head) {
    return {};
  }

  if (head.startsWith(RoutePrefix.User)) {
    const viewedProfileUsername = decodeURLParam(head.slice(1));

    if (second === RouteSegment.Flights) {
      return {
        window: SidepanelWindows.Flights,
        viewedProfileUsername: viewedProfileUsername,
      };
    }

    const selected = parseSelectedItem(second, third);
    if (selected) {
      return {
        window: SidepanelWindows.Flights,
        viewedProfileUsername: viewedProfileUsername,
        selected,
      };
    }

    if (second === RouteSegment.Edit) {
      return {
        window: SidepanelWindows.Profile,
        isEditingProfile: true,
        viewedProfileUsername: viewedProfileUsername,
      };
    }

    return {
      window: SidepanelWindows.Profile,
      viewedProfileUsername: viewedProfileUsername,
    };
  }

  if (head.startsWith(RoutePrefix.Guild)) {
    return { window: SidepanelWindows.Social };
  }

  if (head === RouteSegment.Profile) {
    return {
      window: SidepanelWindows.Profile,
      isEditingProfile: second === RouteSegment.Edit,
    };
  }

  if (head === RouteSegment.Settings) {
    return { window: SidepanelWindows.Settings };
  }

  if (head === RouteSegment.Social) {
    return { window: SidepanelWindows.Social };
  }

  if (head === RouteSegment.Flights) {
    if (second === RouteSegment.New) {
      return {
        window: SidepanelWindows.Flights,
        draft: { type: "new" },
      };
    }

    if (second === RouteSegment.Edit) {
      const flightId = parseURLIntParam(third);
      if (flightId !== undefined) {
        return {
          window: SidepanelWindows.Flights,
          draft: { type: "edit", flightId },
        };
      }
    }

    const selected =
      second === RouteSegment.Flight
        ? parseSelectedItem(second, third)
        : undefined;
    return selected
      ? { window: SidepanelWindows.Flights, selected }
      : { window: SidepanelWindows.Flights };
  }

  const selected = parseSelectedItem(head, second);
  return selected ? { window: SidepanelWindows.Flights, selected } : {};
}

/** Converts a selection URL segment into the corresponding selected item */
function parseSelectedItem(
  segment: string | undefined,
  value: string | undefined,
): Selected | undefined {
  switch (segment) {
    case RouteSegment.Flight: {
      const flightId = parseURLIntParam(value);
      return flightId === undefined
        ? undefined
        : { type: SelectionType.Flight, flightId };
    }
    case RouteSegment.Airport: {
      const airportId = parseURLIntParam(value);
      return airportId === undefined
        ? undefined
        : { type: SelectionType.Airport, airportId };
    }
    case RouteSegment.Route: {
      const routeKey = decodeURLParam(value);
      return routeKey ? { type: SelectionType.Route, routeKey } : undefined;
    }
    case RouteSegment.Airline: {
      const airlineId = parseURLIntParam(value);
      return airlineId !== undefined
        ? { type: SelectionType.Airline, airlineId }
        : undefined;
    }
    case RouteSegment.Aircraft: {
      const aircraftId = parseURLIntParam(value);
      return aircraftId
        ? { type: SelectionType.Aircraft, aircraftId: aircraftId }
        : undefined;
    }
    case RouteSegment.Registration: {
      const registration = decodeURLParam(value);
      return registration
        ? { type: SelectionType.Registration, registration }
        : undefined;
    }
    default:
      return undefined;
  }
}

/** Builds a selection URL, optionally scoped to a user's profile */
function buildSelectionPath(
  selected: Selected | undefined,
  username?: string,
): string {
  const userSegment = username
    ? `${RoutePrefix.User}${encodeURLParam(username)}`
    : undefined;
  const prefix = userSegment ? [userSegment] : [];

  switch (selected?.type) {
    case SelectionType.Flight:
      return joinPathSegments(
        ...prefix,
        RouteSegment.Flight,
        selected.flightId,
      );
    case SelectionType.Airport:
      return joinPathSegments(
        ...prefix,
        RouteSegment.Airport,
        selected.airportId,
      );
    case SelectionType.Route:
      return joinPathSegments(
        ...prefix,
        RouteSegment.Route,
        encodeURLParam(selected.routeKey),
      );
    case SelectionType.Airline:
      return joinPathSegments(
        ...prefix,
        RouteSegment.Airline,
        encodeURLParam(selected.airlineId),
      );
    case SelectionType.Aircraft:
      return joinPathSegments(
        ...prefix,
        RouteSegment.Aircraft,
        encodeURLParam(selected.aircraftId),
      );
    case SelectionType.Registration:
      return joinPathSegments(
        ...prefix,
        RouteSegment.Registration,
        encodeURLParam(selected.registration),
      );
    default:
      return joinPathSegments(...prefix, RouteSegment.Flights);
  }
}

/** Builds the browser pathname for the current navigation state */
export function buildNavigationPath({
  activeWindow,
  selected,
  drafting,
  isEditingProfile,
  viewedProfileUsername,
  currentUsername,
}: NavigationPathState): string {
  if (!activeWindow) {
    return "/";
  }

  if (activeWindow === SidepanelWindows.Settings) {
    return joinPathSegments(RouteSegment.Settings);
  }

  if (activeWindow === SidepanelWindows.Social) {
    return joinPathSegments(RouteSegment.Social);
  }

  // The profile URL is not generic (eg. /profile), but uses the user's username (eg. /@username)
  if (activeWindow === SidepanelWindows.Profile) {
    const profileUser = viewedProfileUsername ?? currentUsername;

    if (profileUser) {
      const userSegment = `${RoutePrefix.User}${encodeURLParam(profileUser)}`;
      return isEditingProfile
        ? joinPathSegments(userSegment, RouteSegment.Edit)
        : joinPathSegments(userSegment);
    }

    return isEditingProfile
      ? joinPathSegments(RouteSegment.Profile, RouteSegment.Edit)
      : joinPathSegments(RouteSegment.Profile);
  }

  if (activeWindow === SidepanelWindows.Flights) {
    if (viewedProfileUsername) {
      return buildSelectionPath(selected, viewedProfileUsername);
    }

    if (drafting?.type === "new") {
      return joinPathSegments(RouteSegment.Flights, RouteSegment.New);
    }

    if (drafting?.type === "edit") {
      return joinPathSegments(
        RouteSegment.Flights,
        RouteSegment.Edit,
        drafting.flightId,
      );
    }

    if (!selected) {
      return joinPathSegments(RouteSegment.Flights);
    }

    return buildSelectionPath(selected);
  }

  return "/";
}
