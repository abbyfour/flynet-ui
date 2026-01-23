import { ArcLayer } from "deck.gl";
import type { Flight } from "../../../data/classes/flights";
import { AppTheme, MapProjection } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";
import { getAirportCoordinates } from "../../../util/mapUtil";
import { flights } from "./flights";

export function FlightsLayer() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const colour: [number, number, number] =
    theme === AppTheme.Dark ? [255, 200, 0] : [211, 47, 0];
  const highlightColour: [number, number, number] =
    theme === AppTheme.Dark ? [255, 255, 255] : [0, 0, 0];

  return new ArcLayer<Flight>({
    id: "flights-layer",
    greatCircle: true,
    getHeight: 0.05,
    beforeId:
      projection === MapProjection.Mercator ? "Place labels" : undefined,
    data: flights,
    pickable: true,
    autoHighlight: true,
    highlightColor: highlightColour,

    // Accessors
    getSourcePosition: (d) => getAirportCoordinates(d.originAirport),
    getTargetPosition: (d) => getAirportCoordinates(d.destinationAirport),

    // Styles
    getWidth: theme === AppTheme.Dark ? 1.5 : 1.5, // wider lines for easier interaction

    getSourceColor: () => colour,
    getTargetColor: () => colour,
  });
}
