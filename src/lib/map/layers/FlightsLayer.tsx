import { ArcLayer } from "deck.gl";
import { AppTheme, MapProjection } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";
import { flights } from "./flights";

export function FlightsLayer() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const colour: [number, number, number] =
    theme === AppTheme.Dark ? [255, 200, 0] : [211, 47, 0];

  return new ArcLayer({
    id: "flights-layer",
    greatCircle: true,
    getHeight: 0.05,
    beforeId:
      projection === MapProjection.Mercator ? "Place labels" : undefined,
    data: flights,

    // Accessors
    getSourcePosition: (d) => d.source,
    getTargetPosition: (d) => d.target,

    // Styles
    getWidth: theme === AppTheme.Dark ? 0.5 : 1,
    widthScale: 1,

    getSourceColor: () => colour,
    getTargetColor: () => colour,
  });
}
