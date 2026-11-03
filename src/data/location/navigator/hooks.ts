import { useSyncExternalStore } from "react";
import type {
  HistoryEntry,
  Location,
  LocationModule,
  LocationOf,
  NavScope,
} from "../Location";
import { useNavigationContext } from "./NavigationContext";
import type { Navigator } from "./Navigator";

/** The navigator itself, for push/replace/back/enterScope/reset. Never re-renders. */
export function useNavigator(): Navigator {
  return useNavigationContext().navigator;
}

/** The current history entry; re-renders on every navigation */
export function useHistoryEntry(): HistoryEntry {
  const navigator = useNavigator();
  return useSyncExternalStore(navigator.subscribe, () => navigator.current);
}

/**
 * The current location. Pass a module to get its narrowed location, or
 * undefined when the app is currently somewhere else.
 */
export function useLocation(): Location;
export function useLocation<M extends LocationModule>(
  module: M,
): LocationOf<M> | undefined;
export function useLocation(module?: LocationModule) {
  const { location } = useHistoryEntry();

  if (module === undefined) {
    return location;
  }

  return location.module === module ? location : undefined;
}

/** Whose data the app is currently showing (self, another user, ...) */
export function useScope(): NavScope {
  return useHistoryEntry().scope;
}

export function useCanGoBack(): boolean {
  const navigator = useNavigator();
  return useSyncExternalStore(navigator.subscribe, () => navigator.canGoBack());
}
