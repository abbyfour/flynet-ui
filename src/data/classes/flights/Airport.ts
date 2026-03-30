import { regionNamesInEnglish } from "@util/iso";

export interface APIAirport {
  airportName: string;

  icaoCode?: string;
  iataCode?: string;
  localCode?: string;

  lat: string;
  lon: string;

  continent: string;
  isoCountry: string;
  isoRegion: string;
  city: string;

  airportType: AirportType;
  id: number;
}

export type AirportType =
  | "large_airport"
  | "medium_airport"
  | "small_airport"
  | "seaplane_base"
  | "heliport";

export class Airport {
  constructor(private raw: APIAirport) {
    if (!raw) this.raw = {} as APIAirport; // to prevent crashes from missing data, but will result in an "Unknown" airport with id -1, so should be avoided if possible
  }

  get name(): string {
    return this.raw.airportName.endsWith(" International Airport") ||
      this.raw.airportName.endsWith(" Intercontinental Airport")
      ? this.raw.airportName.slice(0, -8)
      : this.raw.airportName;
  }

  get coords(): [number, number] {
    return [parseFloat(this.raw.lon), parseFloat(this.raw.lat)];
  }

  get continent(): string {
    return this.raw.continent;
  }

  get isoCountry(): string {
    return regionNamesInEnglish.of(this.raw.isoCountry) || this.raw.isoCountry;
  }

  get isoRegion(): string {
    return this.raw.isoRegion
      ? (this.raw.isoRegion.split("-")[1] ?? this.raw.isoRegion)
      : "";
  }

  get city(): string {
    return this.raw.city || "Unknown";
  }

  get type(): AirportType {
    return this.raw.airportType;
  }

  get id(): number {
    return this.raw?.id || -1;
  }

  // Codes
  get icaoCode(): string | undefined {
    return nullifyAirportCode(this.raw.icaoCode);
  }

  get iataCode(): string | undefined {
    return nullifyAirportCode(this.raw.iataCode);
  }

  get localCode(): string | undefined {
    return nullifyAirportCode(this.raw.localCode);
  }

  get displayCode(): string {
    return this.iataCode || this.icaoCode || this.raw.localCode || "???";
  }
}

function nullifyAirportCode(code: string | undefined): string | undefined {
  return code === "null" ? undefined : code;
}
