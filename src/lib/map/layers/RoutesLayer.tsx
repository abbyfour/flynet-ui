import { ArcLayer } from "deck.gl";
import type { Route } from "../../../data/classes/flights/Route";
import { MapProjection } from "../../../data/classes/ui";
import { type GroupedRoute } from "../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../data/store";
import type { RGB, RGBA } from "../style/colours";
import { useColours } from "../style/useColours";

type RoutesLayerProps = {
  routes: GroupedRoute[];
  selectedFlightId?: number | undefined;
};

export function RoutesLayer({ routes, selectedFlightId }: RoutesLayerProps) {
  const projection = useAppSelector((state) => state.ui.mapProjection);

  const {
    flightLineColour: routeColour,
    flightLineHighlightColour: routeHighlightColour,
    primaryTextColour,
  } = useColours();

  const getRouteColour = routeColourer(routeColour, primaryTextColour);

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
    getWidth: 1.5,

    getSourceColor: (d: GroupedRoute) => getRouteColour(d, selectedFlightId),
    getTargetColor: (d: GroupedRoute) => getRouteColour(d, selectedFlightId),

    updateTriggers: {
      getSourceColor: [selectedFlightId],
      getTargetColor: [selectedFlightId],
    },
  } as any);
}

function routeColourer(routeColour: RGB, primaryTextColour: RGB) {
  return (route: GroupedRoute, selectedFlightId?: number): RGBA | RGB => {
    if (!selectedFlightId) return intensifyColour(route, routeColour);

    return routeIncludesFlight(route, selectedFlightId)
      ? routeColour
      : [...primaryTextColour, 30];
  };
}

const intensifyColour = (route: GroupedRoute, colour: RGB): RGBA => {
  const intensity =
    route.flights.length === 1 ? 60 : Math.min(255, route.flights.length * 40);

  return [...colour, Math.round(intensity)];
};

const routeIncludesFlight = (route: GroupedRoute, flightId?: number) => {
  if (!flightId) return false;

  return route.flights.some((f) => f.id === flightId);
};
