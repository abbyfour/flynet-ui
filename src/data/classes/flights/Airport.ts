export interface APIAirport {
  airportName: string;

  icaoCode?: string;
  iataCode?: string;

  lat: string;
  lon: string;

  continent: string;
  isoCountry: string;
  isoRegion: string;
  city: string;

  airportType: AirportType;
  id: number;
}

export type AirportType = "large_airport" | "medium_airport" | "small_airport";

export class Airport {
  constructor(private raw: APIAirport) {}

  get name(): string {
    return this.raw.airportName;
  }

  get coords(): [number, number] {
    return [parseFloat(this.raw.lon), parseFloat(this.raw.lat)];
  }

  get continent(): string {
    return this.raw.continent;
  }

  get isoCountry(): string {
    return this.raw.isoCountry;
  }

  get isoRegion(): string {
    return this.raw.isoRegion;
  }

  get city(): string {
    return this.raw.city;
  }

  get type(): AirportType {
    return this.raw.airportType;
  }

  get id(): number {
    return this.raw.id;
  }

  // Codes
  get icaoCode(): string | undefined {
    return this.raw.icaoCode;
  }

  get iataCode(): string | undefined {
    return this.raw.iataCode;
  }

  get displayCode(): string {
    return this.iataCode ?? this.icaoCode ?? "000";
  }
}
