import type { Time } from "../../../util/types";

export interface AddFlightRequestBody {
  flightNumber?: string;
  airline?: string;
  date?: string; // ISO format date string
  departureTime?: Time;
  arrivalTime?: Time;
  planeModel?: string;
  planeRegistration?: string;
  note?: string;
  originAirportId?: number;
  destinationAirportId?: number;
}
