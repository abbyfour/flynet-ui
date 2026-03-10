import { useCallback, useEffect } from "react";
import { m } from "../../../../../assets/text/messages";
import {
  clearDraftingFlight,
  clearSelected,
} from "../../../../../data/flightsSlice";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlights,
} from "../../../../../data/services/flights/selectFlights";
import { setSidepanelOptions } from "../../../../../data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "../../../../../data/store";
import { confirm } from "../../../../notices/Confirm";
import { AirportView } from "./AirportView";
import { AddFlight } from "./drafting/AddFlight";
import { EditFlight } from "./drafting/EditFlight";
import { FlightsList } from "./FlightsList";
import { FlightView } from "./FlightView";
import { RouteView } from "./RouteView";

export function FlightsPanel() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const selected = useAppSelector((state) => state.flights.selected);
  const selectedFlights = useAppSelector(selectSelectedFlights);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const flights = useAppSelector(selectFlightsAsObjects);

  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  const flightsReady = !flightsLoading && !flightsErrored;

  const dispatch = useAppDispatch();

  const goBackFromEdit = useCallback(async () => {
    const confirmation = await confirm({
      title: m.confirm.losingChanges.title,
      children: <p>{m.confirm.losingChanges.text}</p>,
      color: "red",
      labels: { confirm: "Yes.", cancel: "Wait, no!" },
    });

    if (confirmation) {
      dispatch(clearDraftingFlight());
    }
  }, [dispatch]);

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
    } else if (selectedFlights && selected && selected.type === "flight") {
      dispatch(
        setSidepanelOptions({
          title: `Flight ${selectedFlights[0].flightNumber ?? ""}`,
          onGoBack: () => dispatch(clearSelected()),
        }),
      );
    } else if (selectedFlights && selected && selected.type === "route") {
      dispatch(
        setSidepanelOptions({
          title: `Route ${selectedFlights[0].origin.displayCode} ↔ ${selectedFlights[0].destination.displayCode}`,
          onGoBack: () => dispatch(clearSelected()),
        }),
      );
    } else if (selectedFlights && selected && selected.type === "airport") {
      dispatch(
        setSidepanelOptions({
          title: `Airport ${selectedFlights[0].origin.displayCode}`,
          onGoBack: () => dispatch(clearSelected()),
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
  }, [dispatch, drafting, selected, selectedFlights, flights, goBackFromEdit]);

  const isListVisible = Boolean(
    flightsReady &&
    (!selectedFlights || selectedFlights.length === 0) &&
    !drafting &&
    flights &&
    flights.length,
  );

  if (!currentUser) {
    return (
      <div>
        <p>Please log in to view your flights.</p>
      </div>
    );
  }

  const showAppropriateView = () => {
    if (drafting?.type === "new") {
      return <AddFlight />;
    }

    if (drafting?.type === "edit") {
      return <EditFlight />;
    }

    if (selected && selected.type === "route") {
      return (
        <RouteView
          route={
            flights.find((flight) => flight.route.key === selected.routeKey)
              ?.route
          }
        />
      );
    }

    if (selected && selected.type === "airport") {
      return (
        <AirportView
          airport={
            flights.find((flight) => flight.origin.id === selected.airportId)
              ?.origin ||
            flights.find(
              (flight) => flight.destination.id === selected.airportId,
            )?.destination
          }
        />
      );
    }

    if (selectedFlights && selectedFlights.length === 1 && !drafting) {
      return <FlightView flight={selectedFlights[0]} />;
    }

    return <></>;
  };

  return (
    <div className="FlightsPanel">
      {showAppropriateView()}

      {/* Must remain rendered so the memory foam list can work */}
      <FlightsList isVisible={isListVisible} />
    </div>
  );
}
