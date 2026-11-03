import type { AnchorHTMLAttributes, MouseEvent } from "react";
import type { Location, NavScope } from "../Location";
import { useHistoryEntry } from "./hooks";
import { useNavigationContext } from "./NavigationContext";
import { buildURL } from "./urlAdapter";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: Location;
  /** Switch to a different scope instead of inheriting the current one */
  scope?: NavScope;
};

/** A real anchor, so middle-click and "open in new tab" work */
export function Link({ to, scope, onClick, children, ...rest }: LinkProps) {
  const { navigator, routes } = useNavigationContext();
  const entry = useHistoryEntry();

  const href = buildURL({ location: to, scope: scope ?? entry.scope }, routes);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.defaultPrevented || event.button !== 0 || modified) {
      return;
    }

    event.preventDefault();

    if (scope) {
      navigator.enterScope(scope, to);
    } else {
      navigator.push(to);
    }
  };

  return (
    <a {...rest} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
