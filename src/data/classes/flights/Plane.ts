import type { APIFlight } from "./Flight";

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
}
