import { decodeURLParam, encodeURLParam } from "@util/urlUtil";
import {
  LocationModule,
  SELF_SCOPE,
  type HistoryEntry,
  type Location,
  type NavScope,
  type AnyRouteDefinition,
  type RouteDefinition,
} from "../Location";
import type { Navigator } from "./Navigator";

type Routes = readonly AnyRouteDefinition[];

// Narrowing a union of routes by module needs a cast TypeScript can't verify
const asAnyRoutes = (routes: Routes) =>
  routes as unknown as readonly RouteDefinition<LocationModule>[];

const USER_PREFIX = "@";

type ParsedURL = { location: Location; scope: NavScope };

/** Splits a leading `/@username` off the path and turns it into a scope */
function splitScope(pathname: string): { scope: NavScope; rest: string } {
  const [head, ...tail] = pathname.split("/").filter(Boolean);

  if (head?.startsWith(USER_PREFIX) && head.length > USER_PREFIX.length) {
    const username = decodeURLParam(head.slice(USER_PREFIX.length));

    if (username) {
      return {
        scope: { type: "user", username },
        rest: `/${tail.join("/")}`,
      };
    }
  }

  return { scope: SELF_SCOPE, rest: pathname || "/" };
}

function scopePrefix(scope: NavScope): string {
  switch (scope.type) {
    case "user":
      return `/${USER_PREFIX}${encodeURLParam(scope.username)}`;
    case "self":
      return "";
  }
}

export function parseLocationFromURL(
  pathname: string,
  search: string,
  routes: Routes,
): ParsedURL {
  const { scope, rest } = splitScope(pathname);
  const params = new URLSearchParams(search);

  // A bare /@username is that user's profile
  if (scope.type !== "self" && rest === "/") {
    return { location: { module: LocationModule.Profile }, scope };
  }

  for (const route of asAnyRoutes(routes)) {
    const location = route.parse(rest, params);
    if (location) {
      return { location, scope };
    }
  }

  return { location: { module: LocationModule.Home }, scope };
}

export function buildURL(
  { location, scope }: Pick<HistoryEntry, "location" | "scope">,
  routes: Routes,
): string {
  const route = asAnyRoutes(routes).find((r) => r.module === location.module);

  if (!route) {
    return "/";
  }

  const { pathname, search } = route.build(location as never);

  // Home has no panel, so it never carries a scope
  const prefix =
    location.module === LocationModule.Home ? "" : scopePrefix(scope);
  const path = pathname === "/" ? prefix || "/" : `${prefix}${pathname}`;

  return search ? `${path}?${search.replace(/^\?/, "")}` : path;
}

/**
 * Keeps the browser URL and the navigator in sync. Returns a function that
 * disconnects it.
 *
 * Entries added by push/enterScope create a browser history entry; back,
 * replace and reset rewrite the current one so the browser stack doesn't
 * grow when the user goes back in-app.
 */
export function connectNavigatorToURL(
  navigator: Navigator,
  routes: Routes,
): () => void {
  const currentURL = () => window.location.pathname + window.location.search;

  const applyURL = () => {
    const { location, scope } = parseLocationFromURL(
      window.location.pathname,
      window.location.search,
      routes,
    );
    navigator.reset(location, scope);
  };

  let previousLength = navigator.entries.length;

  const writeURL = () => {
    const grew = navigator.entries.length > previousLength;
    previousLength = navigator.entries.length;

    const url = buildURL(navigator.current, routes);
    if (url === currentURL()) {
      return;
    }

    if (grew) {
      window.history.pushState({}, "", url);
    } else {
      window.history.replaceState({}, "", url);
    }
  };

  // Resetting from the URL rebuilds the same URL, so writeURL ignores it
  applyURL();
  previousLength = navigator.entries.length;
  writeURL();

  const unsubscribe = navigator.subscribe(writeURL);
  window.addEventListener("popstate", applyURL);

  return () => {
    unsubscribe();
    window.removeEventListener("popstate", applyURL);
  };
}
