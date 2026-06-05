import { AddFlight } from "@components/forms/drafting/AddFlight";
import { EditFlight } from "@components/forms/drafting/EditFlight";
import { AirlineView } from "@components/views/AirlineView";
import { AirportView } from "@components/views/AirportView";
import { FlightView } from "@components/views/FlightView";
import { PlaneView } from "@components/views/PlaneView";
import { RegistrationView } from "@components/views/RegistrationView";
import { RouteView } from "@components/views/RouteView";
import { clearSelection, goBackInSelection } from "@data/flightsSlice";
import { useGetFlightsQuery } from "@data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlights,
} from "@data/services/flights/selectFlights";
import { useGetTailsManifestQuery } from "@data/services/tails";
import { useAppDispatch, useAppSelector } from "@data/store";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { FlightsList } from "./FlightsList";
import {
  useSidepanelHeader,
  useSidepanelRequests,
} from "@components/common/hooks/sidepanel";

export function FlightsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const selected = useAppSelector((state) => state.flights.selected);
  const selectedFlights = useAppSelector(selectSelectedFlights);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const flights = useAppSelector(selectFlightsAsObjects);

  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  useGetTailsManifestQuery(); // fire and forget — just warms the cache

  const flightsReady = !flightsLoading && !flightsErrored;

  const dispatch = useAppDispatch();
  const isViewingDetail = Boolean(drafting?.type || selected);
  const canGoHome = Boolean(!drafting?.type && selected);

  useSidepanelRequests({
    onBackRequest: isViewingDetail
      ? () => {
          if (drafting?.type) {
            return;
          }

          if (selected) {
            dispatch(goBackInSelection());
          }
        }
      : undefined,
    onHomeRequest: isViewingDetail
      ? () => {
          if (drafting?.type) {
            return;
          }

          if (selected) {
            dispatch(clearSelection());
          }
        }
      : undefined,
  });

  const headerTitle = (() => {
    if (drafting?.type) {
      return drafting.type === "new" ? "Add flight" : "Edit flight";
    }

    if (selectedFlights && selected && selected.type === "flight") {
      return `Flight ${selectedFlights[0].flightNumber ?? ""}`;
    }

    if (selectedFlights && selected && selected.type === "route") {
      return `Route ${selectedFlights[0].origin.displayCode} ↔ ${selectedFlights[0].destination.displayCode}`;
    }

    if (selectedFlights && selected && selected.type === "airport") {
      return `Airport ${selectedFlights[0].origin.id === selected.airportId ? selectedFlights[0].origin.displayCode : selectedFlights[0].destination.displayCode}`;
    }

    if (selectedFlights && selected && selected.type === "airline") {
      return `Airline ${selectedFlights[0].airline?.name ?? "N/A"}`;
    }

    if (selectedFlights && selected && selected.type === "plane") {
      return `Plane ${selectedFlights[0].plane?.manufacturerModel ?? "N/A"}`;
    }

    if (selectedFlights && selected && selected.type === "registration") {
      return `Registration ${selectedFlights[0].plane?.registration ?? "N/A"}`;
    }

    return `Flights${flights && flights.length ? ` (${flights.length})` : ""}`;
  })();

  useSidepanelHeader({
    title: headerTitle,
    showGoBack: isViewingDetail,
    showGoHome: canGoHome,
  });

  const isListVisible = Boolean(
    flightsReady &&
    (!selectedFlights || selectedFlights.length === 0) &&
    !drafting &&
    flights &&
    flights.length,
  );

  useEffect(() => {
    if (!isMobile || isListVisible) return;

    // Prevent detail views from inheriting list scroll offset on mobile.
    const scrollArea = panelRef.current?.closest<HTMLElement>(
      ".sidepanel-scroll-area",
    );
    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }
  }, [isMobile, isListVisible, selected, drafting?.type]);

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
    <div className="FlightsPanel" ref={panelRef}>
      {showAppropriateView()}

      {/* Must remain rendered so the memory foam list can work */}
      <FlightsList isVisible={isListVisible} />
    </div>
  );
}
