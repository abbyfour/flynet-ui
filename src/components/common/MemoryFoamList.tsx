import type { FlightsState } from "@data/flightsSlice";
import { useAppSelector } from "@data/store";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

interface MemoryFoamListProps {
  /** Whether the list is currently visible */
  isVisible: boolean;
  /** Redux state key to read scroll position from (must match a number field in FlightsState) */
  storageKey: keyof FlightsState;
  /** Callback to dispatch when scroll position changes */
  onScroll: (position: number) => void;
  /** CSS class selector for the scrollable parent (defaults to ".SidepanelWindow") */
  scrollableParentSelector?: string;
  /** List items to render */
  children: ReactNode;
  /** HTML list element attributes */
  listProps?: React.HTMLAttributes<HTMLUListElement>;
}

/**
 * A list component that automatically remembers scroll position when hidden/shown.
 * Useful for navigating into detail views and returning to the same spot in a list.
 */
export function MemoryFoamList({
  isVisible,
  storageKey,
  onScroll,
  scrollableParentSelector = ".SidepanelWindow",
  children,
  listProps,
}: MemoryFoamListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollPosition = useAppSelector(
    (state) => state.flights[storageKey] as number,
  );
  const scrollPositionRef = useRef(scrollPosition);
  scrollPositionRef.current = scrollPosition;

  const getScrollParent = useCallback(() => {
    return listRef.current?.closest(scrollableParentSelector);
  }, [scrollableParentSelector]);

  // RECORD scroll position when it changes and list is visible
  useEffect(() => {
    if (!isVisible) return;

    const scrollParent = getScrollParent();
    if (!scrollParent) return;

    const handleScroll = () => onScroll(scrollParent.scrollTop);

    scrollParent.addEventListener("scroll", handleScroll);
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, [isVisible, onScroll, getScrollParent]);

  // RESTORE scroll position when list becomes visible again
  useEffect(() => {
    if (!isVisible) return;

    const scrollParent = getScrollParent();
    if (!scrollParent) return;

    setTimeout(() => {
      scrollParent.scrollTop = scrollPositionRef.current;
    }, 0);
  }, [isVisible, getScrollParent]);

  return (
    <ul
      ref={listRef}
      style={{ display: isVisible ? "block" : "none" }}
      {...listProps}
    >
      {children}
    </ul>
  );
}
