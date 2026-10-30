import type { Time } from "@util/types";

/** ISO format date string */
export type APIDateString = string;

export interface AddFlightRequestBody {
  flightNumber?: string;
  date?: APIDateString;
  departureTime?: Time;
  arrivalTime?: Time;
  aircraftId?: number;
  airlineId?: number;
  planeRegistration?: string;
  note?: string;
  originAirportId?: number;
  destinationAirportId?: number;
}

export interface EditFlightRequestBody {
  flightNumber?: string;
  airlineId?: number;
  date?: APIDateString;
  departureTime?: Time;
  arrivalTime?: Time;
  aircraftId?: number;
  planeRegistration?: string;
  note?: string;
  originAirportId?: number;
  destinationAirportId?: number;
}
