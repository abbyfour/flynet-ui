import type { AddFlightRequestBody } from "@data/services/flights/types";
import type { Time } from "@util/types";

export interface FlightDraft {
  flightNumber?: string;
  date?: Date;

  departureTime?: Time;
  arrivalTime?: Time;

  aircraft?: AircraftDraft;
  airline?: AirlineDraft;

  planeRegistration?: string;
  note?: string;

  origin?: AirportDraft;
  destination?: AirportDraft;
}

export interface AirportDraft {
  id: number;
  displayCode: string;
  name: string;
}

export interface AircraftDraft {
  id: number;
  displayCode: string;
  name: string;
}

export interface AirlineDraft {
  id: number;
  displayCode: string;
  name: string;
}

export function draftToNewRequest(draft: FlightDraft): AddFlightRequestBody {
  return {
    flightNumber: draft.flightNumber,
    date: draft.date?.toISOString(),
    departureTime: draft.departureTime,
    arrivalTime: draft.arrivalTime,
    planeRegistration: draft.planeRegistration,
    note: draft.note,

    originAirportId: draft.origin?.id,
    destinationAirportId: draft.destination?.id,
    airlineId: draft.airline?.id,
    aircraftId: draft.aircraft?.id,
  };
}
