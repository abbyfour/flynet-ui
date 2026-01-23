import { type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useControl } from "react-map-gl/maplibre";
import { TestLayer } from "./layers/FlightsLayer";

// Taken straight from documention
function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(
    () =>
      new MapboxOverlay({
        ...props,
        interleaved: true,
      }),
  );

  overlay.setProps(props);

  return null;
}

export function DataLayers() {
  return <DeckGLOverlay layers={[TestLayer()]} />;
}
