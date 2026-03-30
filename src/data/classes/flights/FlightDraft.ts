import type { AddFlightRequestBody } from "@data/services/flights/types";
import type { Time } from "@util/types";

export interface FlightDraft {
  flightNumber?: string;
  airline?: string;
  date?: Date;

  departureTime?: Time;
  arrivalTime?: Time;

  planeModel?: string;
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

export function draftToNewRequest(draft: FlightDraft): AddFlightRequestBody {
  return {
    flightNumber: draft.flightNumber,
    date: draft.date?.toISOString(),
    airline: draft.airline,
    originAirportId: draft.origin?.id,
    destinationAirportId: draft.destination?.id,
    departureTime: draft.departureTime,
    arrivalTime: draft.arrivalTime,
    planeModel: draft.planeModel,
    planeRegistration: draft.planeRegistration,
    note: draft.note,
  };
}
