import { type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useControl } from "react-map-gl/maplibre";
import { useAppSelector } from "../../data/store";
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

  // Also ensure subsequent prop updates include devicePixelRatio
  overlay.setProps({
    ...props,
  });

  return null;
}

export function DataLayers() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  // Key the overlay to projection/theme so it remounts and re-attaches
  // if the map recreates its canvas or style during projection/theme changes.
  const key = `${projection}-${theme}-${
    typeof window !== "undefined" ? window.devicePixelRatio : 1
  }`;

  return <DeckGLOverlay key={key} layers={[TestLayer()]} />;
}
