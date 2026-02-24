import type { GroupedFlightDetails } from "../../services/flights/selectFlights";
import type { UserProperties } from "../user";
import { Airport, type APIAirport } from "./Airport";

export interface APIFlight {
  id: number;
  flightNumber?: string;
  airline?: string;
  date?: Date;

  departureTime?: string;
  arrivalTime?: string;

  planeModel?: string;
  planeRegistration?: string;
  note?: string;

  userId: number;
  user: UserProperties;

  /** Full info of the departure airport */
  originAirport: APIAirport;
  /** Full info of the arrival airport */
  destinationAirport: APIAirport;

  // Deprecated properties
  /** @deprecated Code of the departure airport */
  departureAirport: string;
  /** @deprecated Code of the arrival airport */
  arrivalAirport: string;

  /** @deprecated ID of the departure airport */
  originAirportId: number;
  /** @deprecated ID of the arrival airport */
  destinationAirportId: number;
}

export class Flight {
  public readonly plane: Plane | undefined;
  public readonly origin: Airport;
  public readonly destination: Airport;
  public readonly route: Route;
  public readonly airline: Airline | undefined;

  constructor(private raw: APIFlight) {
    this.plane = Plane.fromRawFlight(raw);
    this.origin = new Airport(raw.originAirport);
    this.destination = new Airport(raw.destinationAirport);
    this.route = new Route(this.origin, this.destination);
    this.airline = raw.airline ? new Airline(raw.airline) : undefined;
  }

  get id(): number {
    return this.raw.id;
  }
  get flightNumber(): string | undefined {
    return this.raw.flightNumber;
  }

  get date(): Date | undefined {
    return this.raw.date;
  }

  get departureTime(): string | undefined {
    return this.raw.departureTime;
  }
  get arrivalTime(): string | undefined {
    return this.raw.arrivalTime;
  }

  get note(): string | undefined {
    return this.raw.note;
  }

  get user(): UserProperties {
    return this.raw.user;
  }

  asGroupedFlightDetails(): GroupedFlightDetails {
    return {
      id: this.id,
      flightNumber: this.flightNumber,
      route: this.route,
    };
  }
}

export class Plane {
  constructor(
    public model?: string,
    public registration?: string,
  ) {}

  public static fromRawFlight(rawFlight: APIFlight): Plane | undefined {
    if (!rawFlight.planeModel && !rawFlight.planeRegistration) {
      return undefined;
    }

    return new Plane(rawFlight.planeModel, rawFlight.planeRegistration);
  }
}

export class Route {
  constructor(
    public origin: Airport,
    public destination: Airport,
  ) {}

  /**
   * A unique key for this route, regardless of direction (e.g. YVR-FRA and FRA-YVR would have the same key)
   */
  get key(): string {
    return [this.origin.id, this.destination.id].sort().join("-");
  }
}

export class Airline {
  constructor(public name: string) {}
}
