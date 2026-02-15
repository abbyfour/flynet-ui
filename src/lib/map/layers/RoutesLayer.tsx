import { ArcLayer } from "deck.gl";
import type { Route } from "../../../data/classes/flights/Flight";
import { AppTheme, MapProjection } from "../../../data/classes/ui";
import type { GroupedRoute } from "../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../data/store";
import type { RGB } from "../style/colours";
import { useColours } from "../style/useColours";

type RoutesLayerProps = {
  routes: GroupedRoute[];
};

export function RoutesLayer({ routes }: RoutesLayerProps) {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const {
    flightLineColour: routeColour,
    flightLineHighlightColour: routeHighlightColour,
  } = useColours();

  return new ArcLayer<Route>({
    id: "routes-layer",
    greatCircle: true,
    getHeight: 0.05,
    beforeId:
      projection === MapProjection.Mercator ? "Place labels" : undefined,
    data: routes,
    pickable: true,
    autoHighlight: true,
    highlightColor: routeHighlightColour,

    // Accessors
    getSourcePosition: (d: GroupedRoute) => d.route.origin.coords,
    getTargetPosition: (d: GroupedRoute) => d.route.destination.coords,
    // Styles
    getWidth: theme === AppTheme.Dark ? 1.5 : 1.5,

    getSourceColor: (d: GroupedRoute) => intensifyColour(d, routeColour),
    getTargetColor: (d: GroupedRoute) => intensifyColour(d, routeColour),
  } as any);
}

const intensifyColour = (route: GroupedRoute, colour: RGB) => {
  const intensity =
    route.flights.length === 1 ? 60 : Math.min(255, route.flights.length * 40);

  return [...colour, Math.round(intensity)];
};
