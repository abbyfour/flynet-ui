import { type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useControl } from "react-map-gl/maplibre";
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
  return <DeckGLOverlay layers={[FlightsLayer()]} />;
}
