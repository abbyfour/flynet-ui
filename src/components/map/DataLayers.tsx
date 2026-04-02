import { SidepanelWindows } from "@data/classes/ui";
import {
  clearHighlights,
  clearSelection,
  recordHighlightedAirport,
  recordHighlightedRoute,
  setSelected,
} from "@data/flightsSlice";
import { useGetFlightsQuery } from "@data/services/flights/flightsAPI";
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
import { useCallback } from "react";
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
  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  const routes = useAppSelector(selectRoutesFromFlights);
  const airports = useAppSelector(selectAirportsFromFlights);
  const selected = useAppSelector((state) => state.flights.selected);
  const highlightedRouteKey = useAppSelector(
    (state) => state.flights.highlightedRouteKey,
  );
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const flightsReady = !flightsLoading && !flightsErrored && currentUser;

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
          highlightedRouteKey,
        }),
      ]}
      pickingRadius={15}
      getTooltip={getTooltip}
      onHover={onHover}
      onClick={onclick}
    />
  );
}
