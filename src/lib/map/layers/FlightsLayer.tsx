import { ArcLayer } from "deck.gl";
import type { Flight } from "../../../data/classes/flights";
import { AppTheme, MapProjection } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";
import { getAirportCoordinates } from "../../../util/mapUtil";
import { useColours } from "../style/useColours";
import { flights } from "./flights";

export function FlightsLayer() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const { flightLineColour, flightLineHighlightColour } = useColours();

  return new ArcLayer<Flight>({
    id: "flights-layer",
    greatCircle: true,
    getHeight: 0.05,
    beforeId:
      projection === MapProjection.Mercator ? "Place labels" : undefined,
    data: flights,
    pickable: true,
    autoHighlight: true,
    highlightColor: flightLineHighlightColour,

    // Accessors
    getSourcePosition: (d: Flight) => getAirportCoordinates(d.originAirport),
    getTargetPosition: (d: Flight) =>
      getAirportCoordinates(d.destinationAirport),

    // Styles
    getWidth: theme === AppTheme.Dark ? 1.5 : 1.5,

    getSourceColor: () => flightLineColour,
    getTargetColor: () => flightLineColour,
  } as any);
}
