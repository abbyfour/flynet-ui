import { ArcLayer } from "deck.gl";
import { AppTheme, MapProjection } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";
import { flights } from "./flights";

export function TestLayer() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const colour: [number, number, number] =
    theme === AppTheme.Dark ? [230, 169, 55] : [0, 0, 0];

  return new ArcLayer({
    id: "test-layer",
    greatCircle: true,
    getHeight: 0.1,
    beforeId:
      projection === MapProjection.Mercator ? "Place labels" : undefined,
    data: flights,

    // Accessors
    getSourcePosition: (d) => d.source,
    getTargetPosition: (d) => d.target,

    // Styles
    getWidth: 3,
    widthScale: 1,

    getSourceColor: () => colour,
    getTargetColor: () => colour,
  });
}
