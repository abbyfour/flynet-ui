import type { Airport } from "./Airport";

export class Route {
  constructor(
    public origin: Airport,
    public destination: Airport,
  ) {}

  /**
   * A unique key for this route, regardless of direction (e.g. YVR-FRA and FRA-YVR would have the same key)
   */
  get key(): string {
    return [this.origin.id, this.destination.id].sort().join("-");
  }
}
