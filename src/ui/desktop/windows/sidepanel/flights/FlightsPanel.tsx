import { useCallback, useEffect } from "react";
import {
  clearSelection,
  goBackInSelection,
} from "../../../../../data/flightsSlice";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlights,
} from "../../../../../data/services/flights/selectFlights";
import { useGetTailsManifestQuery } from "../../../../../data/services/tails";
import { setSidepanelOptions } from "../../../../../data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "../../../../../data/store";
import { AirportView } from "./AirportView";
import { AirlineView } from "./components/AirlineView";
import { PlaneView } from "./components/PlaneView";
import { RegistrationView } from "./components/RegistrationView";
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

  useGetTailsManifestQuery(); // fire and forget — just warms the cache

  const flightsReady = !flightsLoading && !flightsErrored;

  const dispatch = useAppDispatch();

  const onGoHome = useCallback(() => {
    dispatch(dispatch(clearSelection()));
  }, [dispatch]);

  useEffect(() => {
    if (drafting?.type) return;

    if (selectedFlights && selected && selected.type === "flight") {
      dispatch(
        setSidepanelOptions({
          title: `Flight ${selectedFlights[0].flightNumber ?? ""}`,
          onGoBack: () => dispatch(goBackInSelection()),
          onGoHome,
        }),
      );
    } else if (selectedFlights && selected && selected.type === "route") {
      dispatch(
        setSidepanelOptions({
          title: `Route ${selectedFlights[0].origin.displayCode} ↔ ${selectedFlights[0].destination.displayCode}`,
          onGoBack: () => dispatch(goBackInSelection()),
          onGoHome,
        }),
      );
    } else if (selectedFlights && selected && selected.type === "airport") {
      dispatch(
        setSidepanelOptions({
          title: `Airport ${selectedFlights[0].origin.id === selected.airportId ? selectedFlights[0].origin.displayCode : selectedFlights[0].destination.displayCode}`,
          onGoBack: () => dispatch(goBackInSelection()),
          onGoHome,
        }),
      );
    } else if (selectedFlights && selected && selected.type === "airline") {
      dispatch(
        setSidepanelOptions({
          title: `Airline ${selectedFlights[0].airline?.name ?? "N/A"}`,
          onGoBack: () => dispatch(goBackInSelection()),
          onGoHome,
        }),
      );
    } else if (selectedFlights && selected && selected.type === "plane") {
      dispatch(
        setSidepanelOptions({
          title: `Plane ${selectedFlights[0].plane?.manufacturerModel ?? "N/A"}`,
          onGoBack: () => dispatch(goBackInSelection()),
          onGoHome,
        }),
      );
    } else if (
      selectedFlights &&
      selected &&
      selected.type === "registration"
    ) {
      dispatch(
        setSidepanelOptions({
          title: `Registration ${selectedFlights[0].plane?.registration ?? "N/A"}`,
          onGoBack: () => dispatch(goBackInSelection()),
          onGoHome,
        }),
      );
    } else {
      dispatch(
        setSidepanelOptions({
          title: `Flights${flights && flights.length ? ` (${flights.length})` : ""}`,
          onGoBack: undefined,
          onGoHome: undefined,
        }),
      );
    }
  }, [dispatch, drafting?.type, selected, selectedFlights, flights, onGoHome]);

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

    if (selected && selected.type === "airline") {
      return (
        <AirlineView
          airline={
            flights.find(
              (flight) => flight.airline?.name === selected.airlineId,
            )?.airline
          }
        />
      );
    }

    if (selected && selected.type === "plane") {
      return (
        <PlaneView
          plane={
            flights.find((flight) => flight.plane?.model === selected.planeId)
              ?.plane
          }
        />
      );
    }

    if (selected && selected.type === "registration") {
      const plane = flights.find(
        (flight) => flight.plane?.registration === selected.registration,
      )?.plane;

      if (plane) {
        return <RegistrationView plane={plane} />;
      }
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
