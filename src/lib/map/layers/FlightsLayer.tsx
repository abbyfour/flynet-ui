import { ArcLayer } from "deck.gl";
import { AppTheme, MapProjection } from "../../../data/classes/ui";
import { useAppSelector } from "../../../data/store";

export function TestLayer() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const colour: [number, number, number] =
    theme === AppTheme.Dark ? [255, 255, 255] : [0, 0, 0];

  return new ArcLayer({
    id: "test-layer",
    greatCircle: true,
    getHeight: 0.01,
    beforeId:
      projection === MapProjection.Mercator ? "Place labels" : undefined,
    data: [
      // Vancouver to Toronto
      { source: [-123.1207, 49.2827], target: [-79.3832, 43.6532] },
      // New York to London
      { source: [-74.006, 40.7128], target: [-0.1276, 51.5074] },
      // Sydney to Tokyo
      { source: [151.2093, -33.8688], target: [139.6917, 35.6895] },
      // Winnipeg to Mexico City
      { source: [-97.1384, 49.8951], target: [-99.1332, 19.4326] },
      // Vancouver to Istanbul
      { source: [-123.1207, 49.2827], target: [28.9784, 41.0082] },
    ],

    // Accessors
    getSourcePosition: (d) => d.source,
    getTargetPosition: (d) => d.target,

    // Styles
    getWidth: 2,
    widthScale: 1,

    // white arcs
    getSourceColor: () => colour,
    getTargetColor: () => colour,
  });
}
