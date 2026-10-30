import {
  useSidepanelHeader,
  useSidepanelRequests,
} from "@components/common/hooks/sidepanel";
import { AddFlight } from "@components/forms/drafting/AddFlight";
import { EditFlight } from "@components/forms/drafting/EditFlight";
import { AircraftView } from "@components/views/AircraftView";
import { AirlineView } from "@components/views/AirlineView";
import { AirportView } from "@components/views/AirportView";
import { FlightView } from "@components/views/FlightView";
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
import { SelectionType, type Selected } from "@data/services/SelectionHistory";
import { useGetTailsManifestQuery } from "@data/services/tails";
import { useAppDispatch, useAppSelector } from "@data/store";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useMemo, useRef } from "react";
import { FlightsList } from "./FlightsList";

export function FlightsPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const viewedProfileUsername = useAppSelector(
    (state) => state.ui.viewedProfileUsername,
  );
  const isMobile = useMediaQuery("(max-width: 900px)");
  const selected = useAppSelector((state) => state.flights.selected);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const filters = useAppSelector((state) => state.flights.filters);
  const ownFlights = useAppSelector(selectFilteredFlights);

  const isViewingOtherProfile =
    Boolean(viewedProfileUsername) &&
    currentUser?.username !== viewedProfileUsername;

  const { isLoading: ownFlightsLoading, isError: ownFlightsErrored } =
    useGetFlightsQuery(undefined, { skip: !currentUser });
  const {
    data: profileFlights,
    isLoading: profileFlightsLoading,
    isError: profileFlightsErrored,
  } = useGetUserFlightsQuery(viewedProfileUsername ?? "", {
    skip: !isViewingOtherProfile || !viewedProfileUsername,
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

    if (selected && selected.type === SelectionType.Flight) {
      return `Flight ${primaryFlight?.flightNumber ?? selected.flightId}`;
    }

    if (selected && selected.type === SelectionType.Route) {
      return primaryFlight
        ? `Route ${primaryFlight.origin.displayCode} ↔ ${primaryFlight.destination.displayCode}`
        : `Route ${selected.routeKey}`;
    }

    if (selected && selected.type === SelectionType.Airport) {
      if (primaryFlight) {
        return `Airport ${primaryFlight.origin.id === selected.airportId ? primaryFlight.origin.displayCode : primaryFlight.destination.displayCode}`;
      }

      return `Airport ${selected.airportId}`;
    }

    if (selected && selected.type === SelectionType.Airline) {
      return `Airline ${primaryFlight?.airline?.name ?? selected.airlineId}`;
    }

    if (selected && selected.type === SelectionType.Aircraft) {
      return `Plane ${primaryFlight?.aircraft?.manufacturerModel ?? selected.aircraftId}`;
    }

    if (selected && selected.type === SelectionType.Registration) {
      return `Registration ${primaryFlight?.aircraft?.registration ?? selected.registration}`;
    }

    return `Flights${flights && flights.length ? ` (${flights.length})` : ""}`;
  })();

  useSidepanelHeader({
    title: headerTitle,
    showGoBack: isViewingDetail,
    showGoHome: canGoHome,
  });

  const isListVisible = Boolean(
    flightsReady && !selected && !drafting && flights,
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

    if (selected && selected.type === SelectionType.Route) {
      return (
        <RouteView
          route={
            flights.find((flight) => flight.route.key === selected.routeKey)
              ?.route
          }
          flights={selectedFlights}
        />
      );
    }

    if (selected && selected.type === SelectionType.Airport) {
      return (
        <AirportView
          airport={
            flights.find((flight) => flight.origin.id === selected.airportId)
              ?.origin ||
            flights.find(
              (flight) => flight.destination.id === selected.airportId,
            )?.destination
          }
          flights={selectedFlights}
        />
      );
    }

    if (selected && selected.type === SelectionType.Airline) {
      return (
        <AirlineView
          airline={
            flights.find((flight) => flight.airline?.id === selected.airlineId)
              ?.airline
          }
          flights={selectedFlights}
        />
      );
    }

    if (selected && selected.type === SelectionType.Aircraft) {
      return (
        <AircraftView
          aircraft={
            flights.find(
              (flight) => flight.aircraft?.id === selected.aircraftId,
            )?.aircraft
          }
          flights={selectedFlights}
        />
      );
    }

    if (selected && selected.type === SelectionType.Registration) {
      const plane = flights.find(
        (flight) => flight.aircraft?.registration === selected.registration,
      )?.aircraft;

      if (plane) {
        return <RegistrationView aircraft={plane} flights={selectedFlights} />;
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

  if (selected.type === SelectionType.Flight) {
    return flights.filter((flight) => flight.id === selected.flightId);
  }

  if (selected.type === SelectionType.Route) {
    return flights.filter((flight) => flight.route.key === selected.routeKey);
  }

  if (selected.type === SelectionType.Airport) {
    return flights.filter(
      (flight) =>
        flight.origin.id === selected.airportId ||
        flight.destination.id === selected.airportId,
    );
  }

  if (selected.type === SelectionType.Airline) {
    return flights.filter(
      (flight) => flight.airline?.id === selected.airlineId,
    );
  }

  if (selected.type === SelectionType.Aircraft) {
    return flights.filter(
      (flight) => flight.aircraft?.id === selected.aircraftId,
    );
  }

  if (selected.type === SelectionType.Registration) {
    return flights.filter(
      (flight) => flight.aircraft?.registration === selected.registration,
    );
  }

  return [];
}
