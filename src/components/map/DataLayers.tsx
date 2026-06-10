import { flightFilter } from "@data/classes/filters";
import { Flight } from "@data/classes/flights/Flight";
import { SidepanelWindows } from "@data/classes/ui";
import {
  clearHighlights,
  clearSelection,
  recordHighlightedAirport,
  recordHighlightedRoute,
  setSelected,
} from "@data/flightsSlice";
import {
  useGetFlightsQuery,
  useGetUserFlightsQuery,
} from "@data/services/flights/flightsAPI";
import {
  selectAirportsFromFlights,
  selectRoutesFromFlights,
  type GroupedAirport,
  type GroupedRoute,
} from "@data/services/flights/selectFlights";
import { useAppDispatch, useAppSelector } from "@data/store";
import { setActiveSidepanelWindow } from "@data/uiSlice";
import { type DeckProps, type PickingInfo } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useCallback, useMemo } from "react";
import { useControl } from "react-map-gl/maplibre";
import { AirportsLayer } from "./layers/AirportsLayer";
import { RoutesLayer } from "./layers/RoutesLayer";
import { MapTooltip } from "./MapTooltip";

// Taken straight from documention
function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(
    () =>
      new MapboxOverlay({
        ...props,
        interleaved: true,
      }),
  );

  // Also ensure subsequent prop updates include devicePixelRatio
  overlay.setProps({
    ...props,
  });

  return null;
}

export function DataLayers() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileUsername = useAppSelector((state) => state.ui.profileUsername);
  const filters = useAppSelector((state) => state.flights.filters);

  const isViewingOtherProfile =
    Boolean(profileUsername) && currentUser?.username !== profileUsername;

  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery(undefined, {
      skip: !currentUser,
    });
  const {
    data: profileFlights,
    isLoading: profileFlightsLoading,
    isError: profileFlightsErrored,
  } = useGetUserFlightsQuery(profileUsername ?? "", {
    skip: !isViewingOtherProfile || !profileUsername,
  });

  const currentRoutes = useAppSelector(selectRoutesFromFlights);
  const currentAirports = useAppSelector(selectAirportsFromFlights);
  const selected = useAppSelector((state) => state.flights.selected);

  const profileFlightsAsObjects = useMemo(() => {
    const flights = (profileFlights?.items ?? []).map(
      (flight) => new Flight(flight),
    );

    return filters ? flights.filter(flightFilter(filters)) : flights;
  }, [filters, profileFlights?.items]);

  const profileRoutes = useMemo(
    () => groupRoutes(profileFlightsAsObjects),
    [profileFlightsAsObjects],
  );
  const profileAirports = useMemo(
    () => groupAirports(profileFlightsAsObjects),
    [profileFlightsAsObjects],
  );

  const flightsReady = isViewingOtherProfile
    ? !profileFlightsLoading && !profileFlightsErrored
    : !flightsLoading && !flightsErrored && currentUser;

  const routes = isViewingOtherProfile ? profileRoutes : currentRoutes;
  const airports = isViewingOtherProfile ? profileAirports : currentAirports;

  const getTooltip = useCallback(
    ({ object }: PickingInfo<GroupedAirport | GroupedRoute>) =>
      MapTooltip(object),
    [],
  );

  const onHover = useCallback(
    ({ object }: PickingInfo<GroupedAirport | GroupedRoute>) => {
      if (object && "airport" in object) {
        dispatch(recordHighlightedAirport(object.airport.id));
      } else if (object && "route" in object) {
        dispatch(recordHighlightedRoute(object.route.key));
      } else {
        dispatch(clearHighlights());
      }
    },
    [dispatch],
  );

  const onclick = useCallback(
    ({ object }: PickingInfo<GroupedAirport | GroupedRoute>) => {
      if (object && "route" in object) {
        dispatch(setSelected({ type: "route", routeKey: object.route.key }));
        dispatch(setActiveSidepanelWindow(SidepanelWindows.Flights));
      } else if (object && "airport" in object) {
        dispatch(
          setSelected({ type: "airport", airportId: object.airport.id }),
        );
        dispatch(setActiveSidepanelWindow(SidepanelWindows.Flights));
      } else {
        dispatch(clearSelection());
      }
    },
    [dispatch],
  );

  return (
    <DeckGLOverlay
      layers={[
        AirportsLayer({ airports: flightsReady ? airports : [] }),
        RoutesLayer({
          routes: flightsReady ? routes : [],
          selected,
        }),
      ]}
      pickingRadius={15}
      getTooltip={getTooltip}
      onHover={onHover}
      onClick={onclick}
    />
  );
}

function groupRoutes(flights: Flight[]): GroupedRoute[] {
  if (!flights.length) return [];

  const byRoute = new Map<string, GroupedRoute>();

  for (const flight of flights) {
    if (!byRoute.has(flight.route.key)) {
      byRoute.set(flight.route.key, {
        route: flight.route,
        flights: [],
      });
    }

    byRoute.get(flight.route.key)!.flights.push(flight);
  }

  return Array.from(byRoute.values());
}

function groupAirports(flights: Flight[]): GroupedAirport[] {
  if (!flights.length) return [];

  const airportsById = new Map<number, GroupedAirport>();

  for (const flight of flights) {
    if (!airportsById.has(flight.origin.id)) {
      airportsById.set(flight.origin.id, {
        airport: flight.origin,
        flights: [],
      });
    }
    airportsById.get(flight.origin.id)!.flights.push(flight);

    if (!airportsById.has(flight.destination.id)) {
      airportsById.set(flight.destination.id, {
        airport: flight.destination,
        flights: [],
      });
    }
    airportsById.get(flight.destination.id)!.flights.push(flight);
  }

  return Array.from(airportsById.values());
}
