import { Button } from "@components/common/buttons/Button";
import { MemoryFoamList } from "@components/common/MemoryFoamList";
import type { Flight } from "@data/classes/flights/Flight";
import {
  clearSelection,
  recordFlightsListScrollPosition,
  setNewFlight,
  updateFilters,
} from "@data/flightsSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import { setProfileUsername } from "@data/uiSlice";
import { injectMap } from "@util/arrayUtil";
import { useMemo } from "react";
import { FlightListItem } from "./FlightListItem";
import { FlightListSeparator } from "./FlightListSeperator";
import FlightListSkeleton from "./FlightListSkeleton";

import "./FlightsList.scss";

interface FlightsListProps {
  flights: Flight[];
  isLoading?: boolean;
  isVisible?: boolean;
  canAddFlight?: boolean;
}

export function FlightsList({
  flights,
  isLoading = false,
  isVisible = true,
  canAddFlight = true,
}: FlightsListProps) {
  const dispatch = useAppDispatch();

  const highlightedRouteKey = useAppSelector(
    (state) => state.flights.highlightedRouteKey,
  );
  const highlightedAirportId = useAppSelector(
    (state) => state.flights.highlightedAirportId,
  );
  const filters = useAppSelector((state) => state.flights.filters);

  const handleAddFlight = () => {
    dispatch(setNewFlight());
  };

  const handleGoBackToMyFlights = () => {
    dispatch(setProfileUsername(undefined));
    dispatch(clearSelection());
  };

  const flightsReady = !isLoading;

  const separatorMeta = useMemo(() => {
    let upcomingCount = 0;
    const yearCounts = new Map<number, number>();

    for (const flight of flights) {
      if (flight.upcoming) {
        upcomingCount++;
        continue;
      }

      const year = flight.date?.getFullYear();
      if (!year) continue;

      yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
    }

    return { upcomingCount, yearCounts };
  }, [flights]);

  const isHighlighted = (flight: Flight) =>
    highlightedRouteKey === flight.route.key ||
    highlightedAirportId === flight.route.origin.id ||
    highlightedAirportId === flight.route.destination.id;

  return (
    <>
      {isVisible &&
        (canAddFlight ? (
          <Button
            onClick={handleAddFlight}
            disabled={!flightsReady}
            className="add-button"
          >
            Add flight
          </Button>
        ) : (
          <Button onClick={handleGoBackToMyFlights} className="add-button">
            Go back to my flights
          </Button>
        ))}

      {isLoading && <FlightListSkeleton />}

      <MemoryFoamList
        isVisible={isVisible}
        storageKey="flightsListScrollPosition"
        onScroll={(position) =>
          dispatch(recordFlightsListScrollPosition(position))
        }
        scrollableParentSelector=".sidepanel-scroll-area"
      >
        {injectMap(
          flights,
          (flight) => (
            <FlightListItem
              key={`flight-${flight.id}`}
              flight={flight}
              highlighted={isHighlighted(flight)}
            />
          ),
          (cur, prev) => {
            const separator = getSeparator(cur, prev, separatorMeta);
            if (separator) {
              return (
                <FlightListSeparator
                  key={`separator-${cur.id}`}
                  label={separator.label}
                  toggleValue={
                    separator.type === "upcoming"
                      ? filters?.upcoming
                      : filters?.year === separator.year
                  }
                  onToggle={(_label, value) => {
                    if (separator.type === "upcoming") {
                      dispatch(
                        updateFilters({ upcoming: value ? true : undefined }),
                      );
                    } else {
                      if (separator.year) {
                        dispatch(
                          updateFilters({
                            year: value ? separator.year : undefined,
                          }),
                        );
                      }
                    }
                  }}
                />
              );
            }
          },
        )}
      </MemoryFoamList>
    </>
  );
}

function shouldShowUpcomingSeparator(
  cur: Flight,
  prev: Flight | undefined,
): boolean {
  return cur.upcoming && !prev;
}

function shouldShowYearSeparator(
  cur: Flight,
  prev: Flight | undefined,
): boolean {
  return (
    !cur.upcoming &&
    (!prev ||
      (prev.upcoming && !cur.upcoming) ||
      cur.date?.getFullYear() !== prev.date?.getFullYear())
  );
}

type SeparatorMeta = {
  upcomingCount: number;
  yearCounts: Map<number, number>;
};

type SeparatorData =
  | { type: "upcoming"; label: string }
  | { type: "year"; label: string; year?: number };

function getSeparator(
  cur: Flight,
  prev: Flight | undefined,
  meta: SeparatorMeta,
): SeparatorData | undefined {
  if (shouldShowUpcomingSeparator(cur, prev)) {
    return {
      type: "upcoming",
      label: `Upcoming (${meta.upcomingCount})`,
    };
  }

  if (shouldShowYearSeparator(cur, prev)) {
    const year = cur.date?.getFullYear();
    const labelYear = year ?? "No date";
    const count = year ? (meta.yearCounts.get(year) ?? 0) : 0;

    return {
      type: "year",
      year,
      label: `${labelYear} (${count})`,
    };
  }

  return undefined;
}
