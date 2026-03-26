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
];

export class Plane {
  constructor(
    public model?: string,
    public registration?: string,
  ) {}

  public static fromRawFlight(rawFlight: APIFlight): Plane | undefined {
    if (!rawFlight.planeModel && !rawFlight.planeRegistration) {
      return undefined;
    }

    return new Plane(rawFlight.planeModel, rawFlight.planeRegistration);
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
}
