import {
  LocationModule,
  SELF_SCOPE,
  type HistoryEntry,
  type Location,
  type NavScope,
  type AnyRouteDefinition,
  type RouteDefinition,
} from "../Location";
import type { Navigator, PushOptions } from "./Navigator";

const MAX_ENTRIES = 10;

export type CreateNavigatorOptions = {
  routes: readonly AnyRouteDefinition[];
  initialLocation?: Location;
  initialScope?: NavScope;
};

export function createNavigator({
  routes,
  initialLocation = { module: LocationModule.Home },
  initialScope = SELF_SCOPE,
}: CreateNavigatorOptions): Navigator {
  let nextId = 0;
  const listeners = new Set<() => void>();

  const createEntry = (location: Location, scope: NavScope): HistoryEntry => ({
    id: String(nextId++),
    location,
    scope,
  });

  let entries: readonly HistoryEntry[] = [
    createEntry(initialLocation, initialScope),
  ];

  const parentOf = (location: Location): Location => {
    const route = routes.find((r) => r.module === location.module) as
      RouteDefinition<LocationModule> | undefined;

    return (
      route?.parent?.(location as never) ?? { module: LocationModule.Home }
    );
  };

  // Entries are immutable and the array is replaced on every change so that
  // useSyncExternalStore can compare snapshots by reference.
  const commit = (next: readonly HistoryEntry[]) => {
    entries = next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
    listeners.forEach((listener) => listener());
  };

  const current = () => entries[entries.length - 1];

  return {
    get entries() {
      return entries;
    },

    get current() {
      return current();
    },

    push(location: Location, options?: PushOptions) {
      const scope = options?.scope ?? current().scope;
      commit([...entries, createEntry(location, scope)]);
    },

    enterScope(scope: NavScope, location: Location) {
      commit([...entries, createEntry(location, scope)]);
    },

    replace(location: Location) {
      commit([...entries.slice(0, -1), createEntry(location, current().scope)]);
    },

    back() {
      if (entries.length > 1) {
        commit(entries.slice(0, -1));
        return;
      }

      const { location, scope } = current();
      if (location.module === LocationModule.Home) {
        return;
      }

      commit([createEntry(parentOf(location), scope)]);
    },

    canGoBack() {
      return entries.length > 1;
    },

    reset(location: Location, scope: NavScope = SELF_SCOPE) {
      commit([createEntry(location, scope)]);
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
