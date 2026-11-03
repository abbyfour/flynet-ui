import { createContext, useContext } from "react";
import type { AnyRouteDefinition } from "../Location";
import type { Navigator } from "./Navigator";

export type NavigationContextValue = {
  navigator: Navigator;
  routes: readonly AnyRouteDefinition[];
};

export const NavigationContext = createContext<
  NavigationContextValue | undefined
>(undefined);

export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("Navigation hooks must be used inside NavigationProvider");
  }

  return context;
}
