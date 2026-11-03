import { useLayoutEffect, type ReactNode } from "react";
import type { AnyRouteDefinition } from "../Location";
import { NavigationContext } from "./NavigationContext";
import type { Navigator } from "./Navigator";
import { connectNavigatorToURL } from "./urlAdapter";

type NavigationProviderProps = {
  navigator: Navigator;
  routes: readonly AnyRouteDefinition[];
  children: ReactNode;
};

/** Connects the navigator to the browser URL and exposes it to hooks */
export function NavigationProvider({
  navigator,
  routes,
  children,
}: NavigationProviderProps) {
  // A layout effect applies the URL before the first paint, so there is no
  // flash of the initial (Home) location
  useLayoutEffect(
    () => connectNavigatorToURL(navigator, routes),
    [navigator, routes],
  );

  return (
    <NavigationContext.Provider value={{ navigator, routes }}>
      {children}
    </NavigationContext.Provider>
  );
}
