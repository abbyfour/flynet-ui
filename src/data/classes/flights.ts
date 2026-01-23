import type { UserProperties } from "./user";

export interface FlightLog {
  message: string;
  total: number;
  items: Flight[];
}

export interface Flight {
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

  /** @deprecated Code of the departure airport */
  departureAirport: string;
  /** @deprecated Code of the arrival airport */
  arrivalAirport: string;

  /** Full info of the departure airport */
  originAirport: Airport;
  /** Full info of the arrival airport */
  destinationAirport: Airport;

  /** @deprecated ID of the departure airport */
  originAirportId: number;
  /** @deprecated ID of the arrival airport */
  destinationAirportId: number;
}

export interface Airport {
  airportName: string;

  icaoCode?: string;
  iataCode?: string;

  lat: string;
  lon: string;

  continent: string;
  isoCountry: string;
  isoRegion: string;
  airportType: string;
  id: number;
}
