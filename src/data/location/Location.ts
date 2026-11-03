import type { Selected } from "@data/services/SelectionHistory";

export enum LocationModule {
  /** No panel open (the "/" URL) */
  Home = "home",
  Flights = "flights",
  Profile = "profile",
  Social = "social",
  Settings = "settings",
}

/**
 * A serialisable description of "where the user is". Anything you would want
 * in a shared link or bookmark belongs here. Transient view state does not;
 * it stays with the component or store that owns it.
 *
 * Each feature module owns one variant. The core never inspects `module`
 * beyond using it to find the matching route definition.
 */
export type Location =
  | HomeLocation
  | FlightsLocation
  | ProfileLocation
  | SocialLocation
  | SettingsLocation;

/**
 * Which "owner" the whole app is currently viewing. It is not part of any
 * module's Location: every entry carries one, and new entries inherit it.
 * Add variants (e.g. admin impersonation) here without touching modules.
 */
export type NavScope = { type: "self" } | { type: "user"; username: string };
// Future:
// | { type: "club"; clubId: string };

export const SELF_SCOPE: NavScope = { type: "self" };

/** The viewed user's username, or undefined for the signed-in user's own scope */
export function scopeUsername(scope: NavScope): string | undefined {
  return scope.type === "user" ? scope.username : undefined;
}

export type FlightsLocation = {
  module: LocationModule.Flights;
  selected?: Selected;
  draft?: { type: "new" } | { type: "edit"; flightId: number };
};

export type ProfileLocation = {
  module: LocationModule.Profile;
  /** Whose profile is shown is decided by the entry's scope */
  editing?: boolean;
};

export type HomeLocation = { module: LocationModule.Home };
export type SocialLocation = { module: LocationModule.Social };
export type SettingsLocation = { module: LocationModule.Settings };

export type ModuleName = Location["module"];
export type LocationOf<M extends ModuleName> = Extract<Location, { module: M }>;

/**
 * One item in the history stack. `id` is stable, so anything that needs
 * view state to survive back/forward can key its own store by it.
 */
export type HistoryEntry<L extends Location = Location> = {
  id: string;
  location: L;
  /** Fixed when the entry is created and never mutated, so back can't lose it */
  scope: NavScope;
};

/**
 * What a feature module registers with the navigation core. The core only
 * talks to modules through this interface, so adding a feature never means
 * editing a central switch.
 */
export type RouteDefinition<M extends ModuleName = ModuleName> = {
  module: M;

  /**
   * Returns undefined if the pathname does not belong to this module. The
   * scope prefix (`/@user`, `/~club`) is stripped by the core before this is
   * called, and re-added after `build`, so modules never deal with it.
   */
  parse(pathname: string, search: URLSearchParams): LocationOf<M> | undefined;
  build(location: LocationOf<M>): { pathname: string; search?: string };

  /**
   * Where `back()` goes when there is no earlier in-app entry, e.g. after
   * opening a deep link. Return undefined to fall back to the app root.
   */
  parent?(location: LocationOf<M>): Location | undefined;
};

/** Any module's route, so differently-typed routes fit in one list */
export type AnyRouteDefinition = {
  [M in ModuleName]: RouteDefinition<M>;
}[ModuleName];
