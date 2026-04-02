import { type GroupedRoute } from "@data/services/flights/selectFlights";
import type { Selected } from "@data/services/SelectionHistory";
import { ArcLayer } from "deck.gl";
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
    flightLineUpcomingColour: routeUpcomingColour,
  } = useColours();

  const maxRouteFlights = routes.length
    ? Math.max(...routes.map((route) => route.flights.length))
    : 0;

  const getRouteColour = routeColourer(
    routeColour,
    primaryTextColour,
    routeUpcomingColour,
    maxRouteFlights,
  );

  return new ArcLayer<GroupedRoute>({
    id: "routes-layer",
    greatCircle: true,
    getHeight: 0.05,
    // @ts-expect-error MapLibre overlay accepts beforeId even though ArcLayer types omit it.
    beforeId: "Place labels",
    data: routes,
    pickable: true,
    autoHighlight: true,
    highlightColor: routeHighlightColour,

    // Accessors
    getSourcePosition: (d: GroupedRoute) => d.route.origin.coords,
    getTargetPosition: (d: GroupedRoute) => d.route.destination.coords,
    // Styles
    getWidth: 1.7,

    getSourceColor: (d: GroupedRoute) => getRouteColour(d, selected),
    getTargetColor: (d: GroupedRoute) => getRouteColour(d, selected),

    updateTriggers: {
      getSourceColor: [selected],
      getTargetColor: [selected],
    },
  });
}

function routeColourer(
  routeColour: RGB,
  primaryTextColour: RGB,
  routeUpcomingColour: RGB,
  maxRouteFlights: number,
) {
  return (route: GroupedRoute, selected?: Selected): RGBA | RGB => {
    if (!selected && routeIncludesUpcomingFlight(route)) {
      return intensifyColour(
        route,
        routeUpcomingColour,
        maxRouteFlights,
        255 / 2,
      );
    }

    if (!selected) {
      return intensifyColour(route, routeColour, maxRouteFlights);
    }

    return routeIncludesFlight(route, selected)
      ? routeIncludesUpcomingFlight(route)
        ? routeUpcomingColour
        : routeColour
      : [...primaryTextColour, 30];
  };
}

const intensifyColour = (
  route: GroupedRoute,
  colour: RGB,
  maxRouteFlights: number,
  minimumOpacity?: number,
): RGBA => {
  const cappedMaxFlights = Math.min(Math.max(maxRouteFlights, 1), 10);

  // On sparse datasets, keep routes readable by rendering them fully bright.
  const intensity =
    cappedMaxFlights <= 2
      ? 255
      : Math.round(
          (Math.min(route.flights.length, 10) / cappedMaxFlights + 0.05) * 255,
        );

  return [...colour, Math.max(intensity, minimumOpacity ?? 0)];
};

const routeIncludesFlight = (route: GroupedRoute, selected?: Selected) => {
  if (!selected) return false;

  if (selected.type === "airline") {
    return route.flights.some((f) => f.airline?.name === selected.airlineId);
  } else if (selected.type === "flight") {
    return route.flights.some((f) => f.id === selected.flightId);
  } else if (selected.type === "route") {
    return route.route.key === selected.routeKey;
  } else if (selected.type === "airport") {
    return (
      route.route.origin.id === selected.airportId ||
      route.route.destination.id === selected.airportId
    );
  } else if (selected.type === "plane") {
    return route.flights.some((f) => f.plane?.model === selected.planeId);
  } else if (selected.type === "registration") {
    return route.flights.some(
      (f) => f.plane?.registration === selected.registration,
    );
  }

  return false;
};

const routeIncludesUpcomingFlight = (route: GroupedRoute) => {
  return route.flights.some((f) => f.date && f.date > new Date());
};
