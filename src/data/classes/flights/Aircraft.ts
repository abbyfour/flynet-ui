import type { APIFlight } from "./Flight";

const manufacturers = [
  "Boeing",
  "Airbus",
  "Embraer",
  "De Havilland Canada",
  "Fokker",
  "Bombardier",
  "McDonnell Douglas",
  "de Havilland Canada",
  "Sikorsky",
];

export class Aircraft {
  constructor(
    public model?: string,
    public registration?: string,
  ) {}

  public static fromRawFlight(rawFlight: APIFlight): Aircraft | undefined {
    if (!rawFlight.planeModel && !rawFlight.planeRegistration) {
      return undefined;
    }

    return new Aircraft(rawFlight.planeModel, rawFlight.planeRegistration);
  }

  public get id(): string {
    if (!this.model) {
      return "00";
    }

    return this.model;
  }

  public get icaoCode(): string {
    return this.model ?? "";
  }

  public get manufacturer(): string {
    if (!this.model) {
      return "Unknown";
    }

    const modelLower = this.model.toLowerCase();

    for (const manufacturer of manufacturers) {
      if (modelLower.includes(manufacturer.toLowerCase())) {
        return manufacturer;
      }
    }

    return "Unknown";
  }

  public get manufacturerModel(): string {
    if (!this.model) {
      return "Unknown";
    }

    const manufacturer = this.manufacturer;

    if (manufacturer === "Unknown") {
      return this.model;
    }

    return (
      this.model.replace(new RegExp(manufacturer, "i"), "").trim() || "Unknown"
    );
  }

  public deregister(): Aircraft {
    return new Aircraft(this.model, undefined);
  }
}
