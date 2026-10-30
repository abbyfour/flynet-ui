export enum AircraftClass {
  Turboprop = "turboprop",
  Narrowbody = "narrowbody",
  Widebody = "widebody",
  RegionalJet = "regional-jet",
  PistonCommuter = "piston-commuter",
  Helicopter = "helicopter",
  Supersonic = "supersonic",
}

export interface APIAircraft {
  primaryName: string;

  icaoCode: string;
  iataCode?: string;

  manufacturer: string;
  model: string;
  aircraftClass: AircraftClass;
  family?: string;
  yearIntroduced: number;
  id: number;
}

export class Aircraft {
  constructor(
    private raw: APIAircraft,
    private _registration?: string,
  ) {
    if (!raw) this.raw = {} as APIAircraft; // to prevent crashes from missing data, but will result in an "Unknown" airport with id -1, so should be avoided if possible
  }

  public get id(): number {
    return this.raw?.id ?? -1;
  }

  public get icaoCode(): string {
    return this.raw?.icaoCode ?? "";
  }

  public get iataCode(): string {
    return this.raw?.iataCode ?? "";
  }

  public get displayCode(): string {
    return this.raw?.icaoCode ?? this.raw?.iataCode ?? "";
  }

  public get manufacturer(): string {
    return this.raw?.manufacturer ?? "Unknown";
  }

  public get model(): string {
    return this.raw?.model ?? "Unknown";
  }

  public get manufacturerModel(): string {
    return this.raw.primaryName;
  }

  public get aircraftClass(): AircraftClass | undefined {
    return this.raw?.aircraftClass;
  }

  public get family(): string {
    return this.raw?.family ?? "Unknown";
  }

  public get yearIntroduced(): number | undefined {
    return this.raw?.yearIntroduced;
  }

  public get registration(): string | undefined {
    return this._registration;
  }

  public deregister(): Aircraft {
    return new Aircraft(this.raw, undefined);
  }
}
