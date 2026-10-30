export interface APIAirline {
  primaryName: string;
  icaoCode: string;
  iataCode: string;
  alternateNames: string;
  isActive: boolean;
  id: number;
}

export class Airline {
  constructor(private raw: APIAirline) {}

  get id() {
    return this.raw.id;
  }

  get iataCode() {
    return this.raw.iataCode;
  }

  get icaoCode() {
    return this.raw.icaoCode;
  }

  get displayCode() {
    return this.raw.iataCode || this.raw.icaoCode;
  }

  get name() {
    return this.raw.primaryName;
  }

  get alternateNames(): string[] {
    return this.raw.alternateNames?.split(", ").filter(Boolean) ?? [];
  }

  get isActive() {
    return this.raw.isActive;
  }
}
