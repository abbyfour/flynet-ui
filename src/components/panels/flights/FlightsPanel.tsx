import {
  useSidepanelHeader,
  useSidepanelRequests,
} from "@components/common/hooks/sidepanel";
import { AddFlight } from "@components/forms/drafting/AddFlight";
import { EditFlight } from "@components/forms/drafting/EditFlight";
import { AirlineView } from "@components/views/AirlineView";
import { AirportView } from "@components/views/AirportView";
import { FlightView } from "@components/views/FlightView";
import { PlaneView } from "@components/views/PlaneView";
import { RegistrationView } from "@components/views/RegistrationView";
import { RouteView } from "@components/views/RouteView";
import { flightFilter } from "@data/classes/filters";
import { Flight } from "@data/classes/flights/Flight";
import { clearSelection, goBackInSelection } from "@data/flightsSlice";
import {
  useGetFlightsQuery,
  useGetUserFlightsQuery,
} from "@data/services/flights/flightsAPI";
import {
  selectFilteredFlights,
  sortFlights,
} from "@data/services/flights/selectFlights";
import type { Selected } from "@data/services/SelectionHistory";
import { useGetTailsManifestQuery } from "@data/services/tails";
import { useAppDispatch, useAppSelector } from "@data/store";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useMemo, useRef } from "react";
import { FlightsList } from "./FlightsList";

export function FlightsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileUsername = useAppSelector((state) => state.ui.profileUsername);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const selected = useAppSelector((state) => state.flights.selected);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const filters = useAppSelector((state) => state.flights.filters);
  const ownFlights = useAppSelector(selectFilteredFlights);

  const isViewingOtherProfile =
    Boolean(profileUsername) && currentUser?.username !== profileUsername;

  const { isLoading: ownFlightsLoading, isError: ownFlightsErrored } =
    useGetFlightsQuery(undefined, { skip: !currentUser });
  const {
    data: profileFlights,
    isLoading: profileFlightsLoading,
    isError: profileFlightsErrored,
  } = useGetUserFlightsQuery(profileUsername ?? "", {
    skip: !isViewingOtherProfile || !profileUsername,
  });

  useGetTailsManifestQuery(); // fire and forget — just warms the cache

  const profileFlightsAsObjects = useMemo(() => {
    const flights = (profileFlights?.items ?? []).map(
      (flight) => new Flight(flight),
    );

    return (filters ? flights.filter(flightFilter(filters)) : flights).sort(
      sortFlights,
    );
  }, [filters, profileFlights?.items]);

  const flights = isViewingOtherProfile ? profileFlightsAsObjects : ownFlights;
  const selectedFlights = useMemo(
    () => filterFlightsBySelection(flights, selected),
    [flights, selected],
  );

  const flightsReady = isViewingOtherProfile
    ? !profileFlightsLoading && !profileFlightsErrored
    : !ownFlightsLoading && !ownFlightsErrored;

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
    const primaryFlight = selectedFlights?.[0];

    if (drafting?.type) {
      return drafting.type === "new" ? "Add flight" : "Edit flight";
    }

    if (selected && selected.type === "flight") {
      return `Flight ${primaryFlight?.flightNumber ?? selected.flightId}`;
    }

    if (selected && selected.type === "route") {
      return primaryFlight
        ? `Route ${primaryFlight.origin.displayCode} ↔ ${primaryFlight.destination.displayCode}`
        : `Route ${selected.routeKey}`;
    }

    if (selected && selected.type === "airport") {
      if (primaryFlight) {
        return `Airport ${primaryFlight.origin.id === selected.airportId ? primaryFlight.origin.displayCode : primaryFlight.destination.displayCode}`;
      }

      return `Airport ${selected.airportId}`;
    }

    if (selected && selected.type === "airline") {
      return `Airline ${primaryFlight?.airline?.name ?? selected.airlineId}`;
    }

    if (selected && selected.type === "plane") {
      return `Plane ${primaryFlight?.plane?.manufacturerModel ?? selected.planeId}`;
    }

    if (selected && selected.type === "registration") {
      return `Registration ${primaryFlight?.plane?.registration ?? selected.registration}`;
    }

    return `Flights${flights && flights.length ? ` (${flights.length})` : ""}`;
  })();

  useSidepanelHeader({
    title: headerTitle,
    showGoBack: isViewingDetail,
    showGoHome: canGoHome,
  });

  const isListVisible = Boolean(
    flightsReady && !selected && !drafting && flights && flights.length,
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

    if (
      selected &&
      flightsReady &&
      (!selectedFlights || selectedFlights.length === 0)
    ) {
      return (
        <div className="FlightsPanel-empty-state">
          <p>No matching flights found for this selection.</p>
        </div>
      );
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
      return (
        <FlightView
          flight={selectedFlights[0]}
          canEdit={!isViewingOtherProfile}
        />
      );
    }

    return <></>;
  };

  return (
    <div className="FlightsPanel" ref={panelRef}>
      {showAppropriateView()}

      {/* Must remain rendered so the memory foam list can work */}
      <FlightsList
        flights={flights}
        isLoading={!flightsReady}
        isVisible={isListVisible}
        canAddFlight={!isViewingOtherProfile}
      />
    </div>
  );
}

function filterFlightsBySelection(
  flights: Flight[],
  selected: Selected | undefined,
) {
  if (!selected) return [];

  if (selected.type === "flight") {
    return flights.filter((flight) => flight.id === selected.flightId);
  }

  if (selected.type === "route") {
    return flights.filter((flight) => flight.route.key === selected.routeKey);
  }

  if (selected.type === "airport") {
    return flights.filter(
      (flight) =>
        flight.origin.id === selected.airportId ||
        flight.destination.id === selected.airportId,
    );
  }

  if (selected.type === "airline") {
    return flights.filter(
      (flight) => flight.airline?.name === selected.airlineId,
    );
  }

  if (selected.type === "plane") {
    return flights.filter((flight) => flight.plane?.model === selected.planeId);
  }

  if (selected.type === "registration") {
    return flights.filter(
      (flight) => flight.plane?.registration === selected.registration,
    );
  }

  return [];
}
