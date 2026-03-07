import { useEffect } from "react";
import { m } from "../../../../../assets/text/messages";
import type { Flight } from "../../../../../data/classes/flights/Flight";
import {
  clearDraftingFlight,
  clearSelectedFlight,
  recordFlightsListScrollPosition,
  setNewFlight,
} from "../../../../../data/flightsSlice";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlight,
} from "../../../../../data/services/flights/selectFlights";
import { setSidepanelOptions } from "../../../../../data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "../../../../../data/store";
import { injectMap } from "../../../../../util/arrayUtil";
import { Button } from "../../../../buttons/Button";
import { MemoryFoamList } from "../../../../MemoryFoamList";
import { confirm } from "../../../../notices/Confirm";
import { AddFlight } from "./drafting/AddFlight";
import { EditFlight } from "./drafting/EditFlight";
import { FlightListItem } from "./FlightListItem";
import "./Flights.scss";
import { FlightSeparator } from "./FlightSeperator";
import { FlightView } from "./FlightView";

export function Flights() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const selectedFlight = useAppSelector(selectSelectedFlight);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const flights = useAppSelector(selectFlightsAsObjects);
  const highlightedRouteKey = useAppSelector(
    (state) => state.flights.highlightedRouteKey,
  );
  const highlightedAirportId = useAppSelector(
    (state) => state.flights.highlightedAirportId,
  );

  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  const dispatch = useAppDispatch();

  const flightsReady = !flightsLoading && !flightsErrored;

  const goBackFromEdit = async () => {
    console.log("goBackFromEdit called");

    const confirmation = await confirm({
      title: m.confirm.losingChanges.title,
      children: <p>{m.confirm.losingChanges.text}</p>,
      color: "red",
      labels: { confirm: "Yes.", cancel: "Wait, no!" },
    });

    if (confirmation) {
      dispatch(clearDraftingFlight());
    }
  };

  useEffect(() => {
    if (drafting?.type === "new") {
      dispatch(
        setSidepanelOptions({
          title: "Add flight",
          onGoBack: () => dispatch(clearDraftingFlight()),
        }),
      );
    } else if (drafting?.type === "edit") {
      dispatch(
        setSidepanelOptions({
          title: "Edit flight",
          onGoBack: () => goBackFromEdit(),
        }),
      );
    } else if (selectedFlight) {
      dispatch(
        setSidepanelOptions({
          title: `Flight ${selectedFlight.flightNumber ?? ""}`,
          onGoBack: () => dispatch(clearSelectedFlight()),
        }),
      );
    } else if (!drafting) {
      dispatch(
        setSidepanelOptions({
          title: `Flights${flights && flights.length ? ` (${flights.length})` : ""}`,
          onGoBack: undefined,
        }),
      );
    }
  }, [dispatch, drafting, selectedFlight, flights]);

  const handleAddFlight = () => {
    dispatch(setNewFlight({}));
  };

  const isHighlighted = (flight: Flight) =>
    highlightedRouteKey === flight.route.key ||
    highlightedAirportId === flight.route.origin.id ||
    highlightedAirportId === flight.route.destination.id;

  const isListVisible = Boolean(
    flightsReady && !selectedFlight && !drafting && flights && flights.length,
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
      {!drafting && !selectedFlight && (
        <Button onClick={handleAddFlight} disabled={!flightsReady}>
          Add flight
        </Button>
      )}

      {!flightsReady ? <p>Loading flights...</p> : <></>}

      {flightsReady && selectedFlight && !drafting ? (
        <FlightView flight={selectedFlight} />
      ) : (
        <></>
      )}

      {drafting?.type === "new" ? <AddFlight /> : <></>}

      {drafting?.type === "edit" ? <EditFlight /> : <></>}

      <MemoryFoamList
        isVisible={isListVisible}
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
            if (cur.upcoming && !prev) {
              return (
                <FlightSeparator
                  key={`separator-${cur.id}`}
                  label={`Upcoming (${flights.filter((f) => f.upcoming).length})`}
                />
              );
            } else if (
              !cur.upcoming &&
              (!prev ||
                (prev.upcoming && !cur.upcoming) ||
                cur.date?.getFullYear() !== prev.date?.getFullYear())
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
