import { compareObjects } from "../../../util/arrayUtil";
import type { Time } from "../../../util/types";
import type { GroupedFlightDetails } from "../../services/flights/selectFlights";
import type { APIDateString } from "../../services/flights/types";
import type { UserProperties } from "../user";
import { Airline } from "./Airline";
import { Airport, type APIAirport } from "./Airport";
import type { FlightDraft } from "./FlightDraft";
import { Plane } from "./Plane";
import { Route } from "./Route";

export interface APIFlight {
  id: number;
  flightNumber?: string;
  airline?: string;
  date?: APIDateString;

  departureTime?: Time;
  arrivalTime?: Time;

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
  departureAirport?: string;
  /** @deprecated Code of the arrival airport */
  arrivalAirport?: string;

  /** @deprecated ID of the departure airport */
  originAirportId?: number;
  /** @deprecated ID of the arrival airport */
  destinationAirportId?: number;
}

export class Flight {
  public readonly plane: Plane | undefined;
  public readonly origin: Airport;
  public readonly destination: Airport;
  public readonly route: Route;
  public readonly airline: Airline | undefined;

  constructor(protected raw: APIFlight) {
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
    return this.raw.date ? new Date(this.raw.date) : undefined;
  }

  get departureTime(): Time | undefined {
    return this.raw.departureTime;
  }
  get arrivalTime(): Time | undefined {
    return this.raw.arrivalTime;
  }

  get note(): string | undefined {
    return this.raw.note;
  }

  get user(): UserProperties {
    return this.raw.user;
  }

  // Calculated properties

  /**
   * Returns true if the flight hasn't happened yet
   */
  get upcoming(): boolean {
    return !!this.date && this.date > new Date();
  }

  asGroupedFlightDetails(): GroupedFlightDetails {
    return {
      id: this.id,
      flightNumber: this.flightNumber,
      route: this.route,
      date: this.date,
    };
  }

  toDraft(): FlightDraft {
    return {
      flightNumber: this.flightNumber,
      airline: this.airline?.name,
      date: this.raw.date ? new Date(this.raw.date) : undefined,
      departureTime: this.departureTime,
      arrivalTime: this.arrivalTime,
      planeModel: this.plane?.model,
      planeRegistration: this.plane?.registration,
      note: this.note,
      origin: {
        id: this.origin.id,
        name: this.origin.name,
        displayCode: this.origin.displayCode,
      },
      destination: {
        id: this.destination.id,
        name: this.destination.name,
        displayCode: this.destination.displayCode,
      },
    };
  }

  isUnchangedFromDraft(draft?: FlightDraft): boolean {
    if (!draft) return false;

    return compareObjects(
      draft as Record<string, unknown>,
      this.toDraft() as Record<string, unknown>,
    );
  }
}
