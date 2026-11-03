import type { HistoryEntry, Location, NavScope } from "../Location";

export type PushOptions = {
  /** Defaults to the current entry's scope; prefer enterScope to change it */
  scope?: NavScope;
};

/**
 * Core navigation API; framework-agnostic and what the React hooks wrap.
 *
 * Invariant: an entry's scope is fixed at creation. back() only moves between
 * entries, so it can never drop or alter a scope.
 */
export interface Navigator {
  readonly entries: readonly HistoryEntry[];
  readonly current: HistoryEntry;

  /** Push a location, inheriting the current entry's scope unless overridden */
  push(location: Location, options?: PushOptions): void;

  /** Start viewing a different owner (another user, a club, or back to self) */
  enterScope(scope: NavScope, location: Location): void;

  /** Swap the current entry without growing the stack; scope is kept */
  replace(location: Location): void;

  /**
   * Pop one entry. At the root of the stack (e.g. after a deep link) it goes
   * to the route's `parent`, built with the current scope.
   */
  back(): void;

  /** True when there is an earlier entry; the root fallback doesn't count */
  canGoBack(): boolean;

  /** Replace the whole stack (initial load, popstate, "go home") */
  reset(location: Location, scope?: NavScope): void;

  subscribe(listener: () => void): () => void;
}
