import type { Time } from "../../../util/types";

/** ISO format date string */
export type APIDateString = string;

export interface AddFlightRequestBody {
  flightNumber?: string;
  airline?: string;
  date?: APIDateString;
  departureTime?: Time;
  arrivalTime?: Time;
  planeModel?: string;
  planeRegistration?: string;
  note?: string;
  originAirportId?: number;
  destinationAirportId?: number;
}

export interface EditFlightRequestBody {
  flightNumber?: string;
  airline?: string;
  date?: APIDateString;
  departureTime?: Time;
  arrivalTime?: Time;
  planeModel?: string;
  planeRegistration?: string;
  note?: string;
  originAirportId?: number;
  destinationAirportId?: number;
}
