import type { Time } from "../../../lib/forms/types";

export interface NewFlightProperties {
  flightNumber?: string;
  airline?: string;
  date?: Date;

  departureTime?: Time;
  arrivalTime?: Time;

  planeModel?: string;
  planeRegistration?: string;
  note?: string;

  origin?: AirportProperties;
  destination?: AirportProperties;
}

export interface AirportProperties {
  id: number;
  displayCode: string;
  name: string;
}
