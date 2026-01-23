import { ScatterplotLayer } from "deck.gl";
import type { Airport } from "../../../data/classes/flights";
import { AppTheme } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";
import { airports } from "./airports";

export function AirportsLayer() {
  const theme = useAppSelector((state) => state.ui.theme);

  return new ScatterplotLayer<Airport>({
    id: "airports-layer",
    data: airports,
    pickable: true,

    // Accessors
    getPosition: (d) => [parseFloat(d.lon), parseFloat(d.lat), 1000], // lift slightly above terrain/tiles to avoid z-fighting

    // Styles
    getRadius: 1500,
    radiusScale: 1,
    radiusMinPixels: 2, // keep visible when zoomed out
    radiusMaxPixels: 12, // prevent oversized circles when zoomed in

    getFillColor: theme === AppTheme.Dark ? [255, 255, 255] : [0, 0, 0],
  });
}
