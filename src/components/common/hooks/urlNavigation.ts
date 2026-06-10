import { SidepanelWindows } from "@data/classes/ui";
import {
  clearDraftingFlight,
  clearSelection,
  setEditingFlight,
  setNewFlight,
  setSelected,
  type FlightsState,
} from "@data/flightsSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import {
  closeActiveSidepanelWindow,
  setActiveSidepanelWindow,
  setProfileEditing,
  setProfileUsername,
} from "@data/uiSlice";
import { useEffect, useMemo, useRef } from "react";

type RouteState = {
  window?: SidepanelWindows;
  selected?: FlightsState["selected"];
  draft?: FlightsState["inProgressDraft"];
  profileEditing?: boolean;
  profileUsername?: string;
};

function parseIntParam(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function decodeParam(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parsePathname(pathname: string): RouteState {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return {};
  }

  const [head, second, third] = parts;

  if (head.startsWith("@")) {
    const profileUsername = decodeParam(head.slice(1));

    const profileSelected = (() => {
      if (!second || !third) return undefined;

      if (second === "flight") {
        const flightId = parseIntParam(third);
        if (flightId !== undefined) {
          return { type: "flight", flightId } as const;
        }
      }

      if (second === "airport") {
        const airportId = parseIntParam(third);
        if (airportId !== undefined) {
          return { type: "airport", airportId } as const;
        }
      }

      if (second === "route") {
        const routeKey = decodeParam(third);
        if (routeKey) {
          return { type: "route", routeKey } as const;
        }
      }

      if (second === "airline") {
        const airlineId = decodeParam(third);
        if (airlineId) {
          return { type: "airline", airlineId } as const;
        }
      }

      if (second === "plane") {
        const planeId = decodeParam(third);
        if (planeId) {
          return { type: "plane", planeId } as const;
        }
      }

      if (second === "registration") {
        const registration = decodeParam(third);
        if (registration) {
          return { type: "registration", registration } as const;
        }
      }

      return undefined;
    })();

    if (second === "flights") {
      return {
        window: SidepanelWindows.Flights,
        profileUsername,
      };
    }

    if (profileSelected) {
      return {
        window: SidepanelWindows.Flights,
        profileUsername,
        selected: profileSelected,
      };
    }

    if (second === "edit") {
      return {
        window: SidepanelWindows.Profile,
        profileEditing: true,
        profileUsername,
      };
    }

    return {
      window: SidepanelWindows.Profile,
      profileUsername,
    };
  }

  if (head.startsWith("~")) {
    return { window: SidepanelWindows.Social };
  }

  if (head === "profile") {
    return {
      window: SidepanelWindows.Profile,
      profileEditing: second === "edit",
    };
  }

  if (head === "settings") {
    return { window: SidepanelWindows.Settings };
  }

  if (head === "social") {
    return { window: SidepanelWindows.Social };
  }

  if (head === "flights") {
    if (second === "new") {
      return {
        window: SidepanelWindows.Flights,
        draft: { type: "new" },
      };
    }

    if (second === "edit") {
      const flightId = parseIntParam(third);
      if (flightId !== undefined) {
        return {
          window: SidepanelWindows.Flights,
          draft: { type: "edit", flightId },
        };
      }
    }

    if (second === "flight") {
      const flightId = parseIntParam(third);
      if (flightId !== undefined) {
        return {
          window: SidepanelWindows.Flights,
          selected: { type: "flight", flightId },
        };
      }
    }

    return { window: SidepanelWindows.Flights };
  }

  if (head === "flight") {
    const flightId = parseIntParam(second);
    if (flightId !== undefined) {
      return {
        window: SidepanelWindows.Flights,
        selected: { type: "flight", flightId },
      };
    }
  }

  if (head === "airport") {
    const airportId = parseIntParam(second);
    if (airportId !== undefined) {
      return {
        window: SidepanelWindows.Flights,
        selected: { type: "airport", airportId },
      };
    }
  }

  if (head === "route") {
    const routeKey = decodeParam(second);
    if (routeKey) {
      return {
        window: SidepanelWindows.Flights,
        selected: { type: "route", routeKey },
      };
    }
  }

  if (head === "airline") {
    const airlineId = decodeParam(second);
    if (airlineId) {
      return {
        window: SidepanelWindows.Flights,
        selected: { type: "airline", airlineId },
      };
    }
  }

  if (head === "plane") {
    const planeId = decodeParam(second);
    if (planeId) {
      return {
        window: SidepanelWindows.Flights,
        selected: { type: "plane", planeId },
      };
    }
  }

  if (head === "registration") {
    const registration = decodeParam(second);
    if (registration) {
      return {
        window: SidepanelWindows.Flights,
        selected: { type: "registration", registration },
      };
    }
  }

  return {};
}

function encodeParam(value: string): string {
  return encodeURIComponent(value);
}

function buildUserScopedPath(
  encodedUsername: string,
  selected: FlightsState["selected"] | undefined,
  fallback: string,
): string {
  if (selected) {
    switch (selected.type) {
      case "flight":
        return `/@${encodedUsername}/flight/${selected.flightId}`;
      case "airport":
        return `/@${encodedUsername}/airport/${selected.airportId}`;
      case "route":
        return `/@${encodedUsername}/route/${encodeParam(selected.routeKey)}`;
      case "airline":
        return `/@${encodedUsername}/airline/${encodeParam(selected.airlineId)}`;
      case "plane":
        return `/@${encodedUsername}/plane/${encodeParam(selected.planeId)}`;
      case "registration":
        return `/@${encodedUsername}/registration/${encodeParam(selected.registration)}`;
    }
  }

  return fallback;
}

function buildPathname({
  activeWindow,
  selected,
  drafting,
  profileEditing,
  profileUsername,
  username,
}: {
  activeWindow?: SidepanelWindows;
  selected?: FlightsState["selected"];
  drafting?: FlightsState["inProgressDraft"];
  profileEditing?: boolean;
  profileUsername?: string;
  username?: string;
}): string {
  if (!activeWindow) {
    return "/";
  }

  if (activeWindow === SidepanelWindows.Settings) {
    return "/settings";
  }

  if (activeWindow === SidepanelWindows.Social) {
    return "/social";
  }

  if (activeWindow === SidepanelWindows.Profile) {
    const user = profileUsername ?? username;
    if (user) {
      const encoded = encodeParam(user);
      return profileEditing ? `/@${encoded}/edit` : `/@${encoded}`;
    }
    return profileEditing ? "/profile/edit" : "/profile";
  }

  if (activeWindow === SidepanelWindows.Flights) {
    if (profileUsername) {
      const encoded = encodeParam(profileUsername);
      return buildUserScopedPath(encoded, selected, `/@${encoded}/flights`);
    }

    if (drafting?.type === "new") return "/flights/new";
    if (drafting?.type === "edit") return `/flights/edit/${drafting.flightId}`;
    if (!selected) return "/flights";

    switch (selected.type) {
      case "flight":
        return `/flight/${selected.flightId}`;
      case "airport":
        return `/airport/${selected.airportId}`;
      case "route":
        return `/route/${encodeParam(selected.routeKey)}`;
      case "airline":
        return `/airline/${encodeParam(selected.airlineId)}`;
      case "plane":
        return `/plane/${encodeParam(selected.planeId)}`;
      case "registration":
        return `/registration/${encodeParam(selected.registration)}`;
      default:
        return "/flights";
    }
  }

  return "/";
}

export function useUrlNavigationSync() {
  const dispatch = useAppDispatch();
  const activeWindow = useAppSelector(
    (state) => state.ui.activeSidepanelWindow,
  );
  const selected = useAppSelector((state) => state.flights.selected);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const profileEditing = useAppSelector((state) => state.ui.profileEditing);
  const profileUsername = useAppSelector((state) => state.ui.profileUsername);
  const currentUsername = useAppSelector(
    (state) => state.user.currentUser?.username,
  );

  const suppressNextWriteRef = useRef(false);

  useEffect(() => {
    const applyPathname = (pathname: string) => {
      const route = parsePathname(pathname);
      suppressNextWriteRef.current = true;

      dispatch(setProfileUsername(undefined));
      dispatch(setProfileEditing(false));
      dispatch(clearDraftingFlight());
      dispatch(clearSelection());

      if (!route.window) {
        dispatch(closeActiveSidepanelWindow());
        return;
      }

      dispatch(setActiveSidepanelWindow(route.window));

      if (route.profileUsername) {
        dispatch(setProfileUsername(route.profileUsername));
      }

      if (route.window === SidepanelWindows.Profile) {
        dispatch(setProfileEditing(Boolean(route.profileEditing)));
      }

      if (route.window === SidepanelWindows.Flights) {
        if (route.draft?.type === "new") {
          dispatch(setNewFlight());
        } else if (route.draft?.type === "edit") {
          dispatch(setEditingFlight({ flightId: route.draft.flightId }));
        }

        if (route.selected) {
          dispatch(setSelected(route.selected));
        }
      }
    };

    applyPathname(window.location.pathname);

    const onPopState = () => {
      applyPathname(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [dispatch]);

  const pathname = useMemo(
    () =>
      buildPathname({
        activeWindow,
        selected,
        drafting,
        profileEditing,
        profileUsername,
        username: currentUsername,
      }),
    [
      activeWindow,
      currentUsername,
      drafting,
      profileEditing,
      profileUsername,
      selected,
    ],
  );

  useEffect(() => {
    if (suppressNextWriteRef.current) {
      suppressNextWriteRef.current = false;
      return;
    }

    if (window.location.pathname === pathname) {
      return;
    }

    window.history.pushState({}, "", pathname);
  }, [pathname]);
}
