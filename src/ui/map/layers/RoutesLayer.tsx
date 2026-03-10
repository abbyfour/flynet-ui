import { ArcLayer } from "deck.gl";
import type { Route } from "../../../data/classes/flights/Route";
import type { Selected } from "../../../data/flightsSlice";
import { type GroupedRoute } from "../../../data/services/flights/selectFlights";
import type { RGB, RGBA } from "../style/colours";
import { useColours } from "../style/useColours";

type RoutesLayerProps = {
  routes: GroupedRoute[];
  selected?: Selected;
};

export function RoutesLayer({ routes, selected }: RoutesLayerProps) {
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
    beforeId: "Place labels",
    data: routes,
    pickable: true,
    autoHighlight: true,
    highlightColor: routeHighlightColour,

    // Accessors
    getSourcePosition: (d: GroupedRoute) => d.route.origin.coords,
    getTargetPosition: (d: GroupedRoute) => d.route.destination.coords,
    // Styles
    getWidth: 1.5,

    getSourceColor: (d: GroupedRoute) => getRouteColour(d, selected),
    getTargetColor: (d: GroupedRoute) => getRouteColour(d, selected),

    updateTriggers: {
      getSourceColor: [selected],
      getTargetColor: [selected],
    },
  } as any);
}

function routeColourer(routeColour: RGB, primaryTextColour: RGB) {
  return (route: GroupedRoute, selected?: Selected): RGBA | RGB => {
    if (!selected) return intensifyColour(route, routeColour);

    return routeIncludesFlight(route, selected)
      ? routeColour
      : [...primaryTextColour, 30];
  };
}

const intensifyColour = (route: GroupedRoute, colour: RGB): RGBA => {
  const intensity =
    route.flights.length === 1 ? 60 : Math.min(255, route.flights.length * 40);

  return [...colour, Math.round(intensity)];
};

const routeIncludesFlight = (route: GroupedRoute, selected?: Selected) => {
  if (!selected) return false;

  if (selected.type === "flight") {
    return route.flights.some((f) => f.id === selected.flightId);
  } else if (selected.type === "route") {
    return route.route.key === selected.routeKey;
  } else if (selected.type === "airport") {
    return (
      route.route.origin.id === selected.airportId ||
      route.route.destination.id === selected.airportId
    );
  }

  return false;
};
