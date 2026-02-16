import { type DeckProps, type PickingInfo } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useCallback } from "react";
import { useControl } from "react-map-gl/maplibre";
import { useGetFlightsQuery } from "../../data/services/flights/flightsAPI";
import {
  selectAirportsFromFlights,
  selectRoutesFromFlights,
  type GroupedAirport,
  type GroupedRoute,
} from "../../data/services/flights/selectFlights";
import { useAppDispatch, useAppSelector } from "../../data/store";
import {
  clearHighlights,
  recordHighlightedAirport,
  recordHighlightedRoute,
} from "../../data/uiSlice";
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

  const flightsReady = !flightsLoading && !flightsErrored;

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

  return (
    <DeckGLOverlay
      layers={[
        AirportsLayer({ airports: flightsReady ? airports : [] }),
        RoutesLayer({ routes: flightsReady ? routes : [] }),
      ]}
      getTooltip={getTooltip}
      onHover={onHover}
    />
  );
}
