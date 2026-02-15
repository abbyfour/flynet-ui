import type { APIFlight } from "./Flight";

export interface APIFlightLog {
  message: string;
  total: number;
  items: APIFlight[];
}
