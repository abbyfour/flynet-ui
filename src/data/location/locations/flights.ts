import { SelectionType, type Selection } from "@location/Selection";
import {
  decodeURLParam,
  encodeURLParam,
  joinPathSegments,
  parseURLIntParam,
} from "@util/urlUtil";
import {
  LocationModule,
  type FlightsLocation,
  type RouteDefinition,
} from "../Location";

enum Segment {
  Flights = "flights",
  New = "new",
  Edit = "edit",
  Flight = "flight",
  Route = "route",
  Airport = "airport",
  Airline = "airline",
  Aircraft = "aircraft",
  Registration = "registration",
}

const flights = (): FlightsLocation => ({ module: LocationModule.Flights });

const withSelected = (selected: Selection | undefined): FlightsLocation =>
  selected ? { ...flights(), selected } : flights();

function parseSelected(
  segment: string,
  value: string | undefined,
): Selection | undefined {
  switch (segment) {
    case Segment.Flight: {
      const flightId = parseURLIntParam(value);
      return flightId === undefined
        ? undefined
        : { type: SelectionType.Flight, flightId };
    }
    case Segment.Route: {
      const routeKey = decodeURLParam(value);
      return routeKey ? { type: SelectionType.Route, routeKey } : undefined;
    }
    case Segment.Airport: {
      const airportId = parseURLIntParam(value);
      return airportId === undefined
        ? undefined
        : { type: SelectionType.Airport, airportId };
    }
    case Segment.Airline: {
      const airlineId = parseURLIntParam(value);
      return airlineId === undefined
        ? undefined
        : { type: SelectionType.Airline, airlineId };
    }
    case Segment.Aircraft: {
      const aircraftId = parseURLIntParam(value);
      return aircraftId === undefined
        ? undefined
        : { type: SelectionType.Aircraft, aircraftId };
    }
    case Segment.Registration: {
      const registration = decodeURLParam(value);
      return registration
        ? { type: SelectionType.Registration, registration }
        : undefined;
    }
    default:
      return undefined;
  }
}

function buildSelected(selected: Selection): string {
  switch (selected.type) {
    case SelectionType.Flight:
      return joinPathSegments(Segment.Flight, selected.flightId);
    case SelectionType.Route:
      return joinPathSegments(Segment.Route, encodeURLParam(selected.routeKey));
    case SelectionType.Airport:
      return joinPathSegments(Segment.Airport, selected.airportId);
    case SelectionType.Airline:
      return joinPathSegments(Segment.Airline, selected.airlineId);
    case SelectionType.Aircraft:
      return joinPathSegments(Segment.Aircraft, selected.aircraftId);
    case SelectionType.Registration:
      return joinPathSegments(
        Segment.Registration,
        encodeURLParam(selected.registration),
      );
  }
}

/**
 * Paths (the core adds the /@user scope prefix):
 *   /flights                      list
 *   /flights/new                  new flight draft
 *   /flights/edit/:flightId       edit flight draft
 *   /flight/:id, /route/:key, /airport/:id, /airline/:id,
 *   /aircraft/:id, /registration/:reg   detail views
 */
export const flightsRoute: RouteDefinition<LocationModule.Flights> = {
  module: LocationModule.Flights,

  parse(pathname) {
    const [head, second, third, ...rest] = pathname.split("/").filter(Boolean);

    if (rest.length > 0) {
      return undefined;
    }

    if (head === Segment.Flights) {
      if (second === undefined) {
        return flights();
      }

      if (second === Segment.New && third === undefined) {
        return { ...flights(), draft: { type: "new" } };
      }

      if (second === Segment.Edit) {
        const flightId = parseURLIntParam(third);
        return flightId === undefined
          ? undefined
          : { ...flights(), draft: { type: "edit", flightId } };
      }

      return undefined;
    }

    if (head === undefined || third !== undefined) {
      return undefined;
    }

    const selected = parseSelected(head, second);
    return selected ? withSelected(selected) : undefined;
  },

  build({ selected, draft }) {
    if (draft?.type === "new") {
      return { pathname: joinPathSegments(Segment.Flights, Segment.New) };
    }

    if (draft?.type === "edit") {
      return {
        pathname: joinPathSegments(
          Segment.Flights,
          Segment.Edit,
          draft.flightId,
        ),
      };
    }

    return {
      pathname: selected
        ? buildSelected(selected)
        : joinPathSegments(Segment.Flights),
    };
  },

  parent({ selected, draft }) {
    if (draft?.type === "edit") {
      return withSelected({
        type: SelectionType.Flight,
        flightId: draft.flightId,
      });
    }

    if (draft || selected) {
      return flights();
    }

    return undefined;
  },
};
