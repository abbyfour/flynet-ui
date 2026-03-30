import { Button } from "@components/common/buttons/Button";
import { MemoryFoamList } from "@components/common/MemoryFoamList";
import type { Flight } from "@data/classes/flights/Flight";
import {
  recordFlightsListScrollPosition,
  setNewFlight,
  updateFilters,
} from "@data/flightsSlice";
import { useGetFlightsQuery } from "@data/services/flights/flightsAPI";
import { selectFilteredFlights } from "@data/services/flights/selectFlights";
import { useAppDispatch, useAppSelector } from "@data/store";
import { injectMap } from "@util/arrayUtil";
import { FlightListItem } from "./FlightListItem";
import { FlightListSeparator } from "./FlightListSeperator";
import FlightListSkeleton from "./FlightListSkeleton";

import "./FlightsList.scss";

interface FlightsListProps {
  isVisible?: boolean;
}

export function FlightsList({ isVisible = true }: FlightsListProps) {
  const dispatch = useAppDispatch();

  const flights = useAppSelector(selectFilteredFlights);
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

  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  const flightsReady = !flightsLoading && !flightsErrored;

  const isHighlighted = (flight: Flight) =>
    highlightedRouteKey === flight.route.key ||
    highlightedAirportId === flight.route.origin.id ||
    highlightedAirportId === flight.route.destination.id;

  return (
    <>
      {isVisible && (
        <Button
          onClick={handleAddFlight}
          disabled={!flightsReady}
          className="add-button"
        >
          Add flight
        </Button>
      )}

      {flightsLoading && <FlightListSkeleton />}

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
            if (shouldShowSeparator(cur, prev)) {
              return (
                <FlightListSeparator
                  key={`separator-${cur.id}`}
                  label={getSeparatorLabel(cur, prev, flights)}
                  toggleValue={
                    getSeparatorLabel(cur, prev, flights)
                      .toString()
                      .startsWith("Upcoming")
                      ? filters?.upcoming
                      : filters?.year === cur.date?.getFullYear()
                  }
                  onToggle={(label, value) => {
                    if (label.toString().startsWith("Upcoming")) {
                      dispatch(
                        updateFilters({ upcoming: value ? true : undefined }),
                      );
                    } else {
                      const year = parseInt(label.toString());
                      if (!isNaN(year)) {
                        dispatch(
                          updateFilters({ year: value ? year : undefined }),
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

function shouldShowSeparator(cur: Flight, prev: Flight | undefined): boolean {
  return (
    // Show separator before the first upcoming flight
    shouldShowUpcomingSeparator(cur, prev) ||
    // Show separator before the first flight of a different year (or no year)
    shouldShowYearSeparator(cur, prev)
  );
}

function getSeparatorLabel(
  cur: Flight,
  prev: Flight | undefined,
  flights: Flight[],
): string {
  if (shouldShowUpcomingSeparator(cur, prev)) {
    return `Upcoming (${flights.filter((f) => f.upcoming).length})`;
  } else if (shouldShowYearSeparator(cur, prev)) {
    return `${cur.date?.getFullYear() || "No date"} (${flights.filter((f) => !f.upcoming && f.date?.getFullYear() === cur.date?.getFullYear()).length})`;
  }

  return "";
}
