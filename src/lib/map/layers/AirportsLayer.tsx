import { ScatterplotLayer } from "deck.gl";
import type { GroupedAirport } from "../../../data/services/flights/selectFlights";
import type { RGB, RGBA } from "../style/colours";
import { useColours } from "../style/useColours";

type AirportsLayerProps = {
  airports: GroupedAirport[];
};

export function AirportsLayer({ airports }: AirportsLayerProps) {
  const { airportDotColour } = useColours();

  return new ScatterplotLayer<GroupedAirport>({
    id: "airports-layer",
    data: airports,
    pickable: true,

    // Accessors
    getPosition: (d: GroupedAirport) => [...d.airport.coords, 1000], // lift slightly above terrain/tiles to avoid z-fighting

    // Styles
    getRadius: 1500,
    radiusScale: 1,
    radiusMinPixels: 2.5, // keep visible when zoomed out
    radiusMaxPixels: 12, // prevent oversized circles when zoomed in

    getFillColor: (d: GroupedAirport) => intensifyColour(d, airportDotColour),
  });
}

// Does not work for light mode really...
const intensifyColour = (route: GroupedAirport, colour: RGB): RGBA => {
  const intensity =
    route.flights.length === 1
      ? 60
      : route.flights.length < 3
        ? 80
        : route.flights.length < 5
          ? 150
          : Math.min(255, 200 + route.flights.length * 10);

  return [...colour, Math.round(intensity)];
};
