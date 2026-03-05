import type { Flight } from "../../../../../data/classes/flights/Flight";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlight,
} from "../../../../../data/services/flights/selectFlights";
import { useAppDispatch, useAppSelector } from "../../../../../data/store";
import {
  openNewFlightForm,
  recordFlightsListScrollPosition,
} from "../../../../../data/uiSlice";
import { MemoryFoamList } from "../../../../../lib/uilib/MemoryFoamList";
import { injectMap } from "../../../../../util/arrayUtil";
import { AddFlight } from "./AddFlight/AddFlight";
import { FlightListItem } from "./FlightListItem";
import "./Flights.scss";
import { FlightSeparator } from "./FlightSeperator";
import { FlightView } from "./FlightView";

export function Flights() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const selectedFlight = useAppSelector(selectSelectedFlight);
  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();
  const newFlight = useAppSelector((state) => state.ui.newFlight);
  const dispatch = useAppDispatch();

  const flightsReady = !flightsLoading && !flightsErrored;

  const flights = useAppSelector(selectFlightsAsObjects);
  const highlightedRouteKey = useAppSelector(
    (state) => state.ui.highlightedRouteKey,
  );
  const highlightedAirportId = useAppSelector(
    (state) => state.ui.highlightedAirportId,
  );

  const handleAddFlight = () => {
    dispatch(openNewFlightForm());
  };

  const isHighlighted = (flight: Flight) =>
    highlightedRouteKey === flight.route.key ||
    highlightedAirportId === flight.route.origin.id ||
    highlightedAirportId === flight.route.destination.id;

  const isListVisible = Boolean(
    flightsReady && !selectedFlight && !newFlight && flights && flights.length,
  );

  if (!currentUser) {
    return (
      <div>
        <p>Please log in to view your flights.</p>
      </div>
    );
  }

  return (
    <div className="Flights">
      <h3 className="title">
        Flights{" "}
        <button type="button" onClick={handleAddFlight}>
          +
        </button>
      </h3>

      {!flightsReady ? <p>Loading flights...</p> : <></>}

      {flightsReady && selectedFlight && !newFlight ? (
        <FlightView flight={selectedFlight} />
      ) : (
        <></>
      )}

      {newFlight ? <AddFlight /> : <></>}

      <MemoryFoamList
        isVisible={isListVisible}
        storageKey="flightsListScrollPosition"
        onScroll={(position) =>
          dispatch(recordFlightsListScrollPosition(position))
        }
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
            if (cur.upcoming && !prev) {
              return (
                <FlightSeparator
                  key={`separator-${cur.id}`}
                  label={`Upcoming (${flights.filter((f) => f.upcoming).length})`}
                />
              );
            } else if (
              !prev ||
              (prev.upcoming && !cur.upcoming) ||
              cur.date?.getFullYear() !== prev.date?.getFullYear()
            ) {
              return (
                <FlightSeparator
                  key={`separator-${cur.id}`}
                  label={`${cur.date?.getFullYear() || "No date"} (${flights.filter((f) => !f.upcoming && f.date?.getFullYear() === cur.date?.getFullYear()).length})`}
                />
              );
            }
          },
        )}
      </MemoryFoamList>
    </div>
  );
}
