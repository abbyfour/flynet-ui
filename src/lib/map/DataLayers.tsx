import { type DeckProps, type PickingInfo } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useCallback } from "react";
import { useControl } from "react-map-gl/maplibre";
import type { Airport, Flight } from "../../data/classes/flights";
import { AirportsLayer } from "./layers/AirportsLayer";
import { FlightsLayer } from "./layers/FlightsLayer";

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
  const getTooltip = useCallback(
    ({ object }: PickingInfo<Airport | Flight>) => {
      if (object && "airportName" in object) {
        return `${object.airportName} (${object.iataCode})`;
      }
      if (object && "flightNumber" in object) {
        return `Flight ${object.flightNumber}: ${object.originAirport.iataCode} → ${object.destinationAirport.iataCode}`;
      }
      return null;
    },
    [],
  );

  return (
    <DeckGLOverlay
      layers={[AirportsLayer(), FlightsLayer()]}
      getTooltip={getTooltip}
    />
  );
}
