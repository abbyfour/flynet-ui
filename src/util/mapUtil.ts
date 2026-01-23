export type Coordinates = [number, number, number?];

export function getAirportCoordinates(airport: {
  lat: string;
  lon: string;
}): [number, number] {
  return [parseFloat(airport.lon), parseFloat(airport.lat)];
}
