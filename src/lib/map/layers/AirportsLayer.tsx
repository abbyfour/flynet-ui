import { ScatterplotLayer } from "deck.gl";
import type { Airport } from "../../../data/classes/flights";
import { useColours } from "../style/useColours";
import { airports } from "./airports";

export function AirportsLayer() {
  const { airportDotColour } = useColours();

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

    getFillColor: airportDotColour,
  });
}
