export class Airline {
  constructor(public name: string) {}

  get iataCode() {
    return "AA";
  }

  get id() {
    return this.name;
  }
}
