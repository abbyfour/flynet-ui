import type { Airport } from "../../../../../data/classes/flights/Airport";
import { selectSelectedFlights } from "../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../data/store";
import { FlightListItem } from "./FlightListItem";

import { uniquifyBy } from "../../../../../util/arrayUtil";
import { displayAirportType } from "../../../../../util/flights";
import "./AirportView.scss";
import { AirportCodePill } from "./components/AirportDisplay";

export function AirportView({ airport }: { airport: Airport | undefined }) {
  const flights = useAppSelector((state) => selectSelectedFlights(state));

  if (!airport || !flights || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="AirportView">
      <h4 className="title">{airport.name}</h4>

      <div className="code">
        <h5>Code:</h5>
        <AirportCodePill airport={airport} />
      </div>

      <div className="location">
        <h5>Location:</h5>
        <span>
          {airport.city}, {airport.isoRegion}, {airport.isoCountry}
        </span>
      </div>

      <div className="type">
        <h5>Type:</h5>
        <span>{displayAirportType(airport.type)}</span>
      </div>

      <div className="coordinates">
        <h5>Coordinates:</h5>
        <span>
          {airport.coords[0].toFixed(4)}, {airport.coords[1].toFixed(4)}
        </span>
      </div>

      <div className="destinations">
        <h5>Destinations:</h5>
        <div className="destinations-list">
          {uniquifyBy(
            flights
              .filter(
                (flight) =>
                  flight.origin.id === airport.id ||
                  flight.destination.id === airport.id,
              )
              .flatMap((flight) =>
                [flight.origin, flight.destination].filter(
                  (a) => a.id !== airport.id,
                ),
              ),
            (a) => a.id,
          )
            .sort((a, b) => a.city.localeCompare(b.city))
            .map((airport) => (
              <span className="destination" key={airport.id}>
                <AirportCodePill airport={airport} /> {airport.city}
              </span>
            ))}
        </div>
      </div>

      <div>
        <h5>Flights:</h5>

        <p className="flight-count">
          {flights.length} flights to or from this airport
        </p>
      </div>

      <div className="flights">
        <div className="flight-list">
          {flights.map((flight) => (
            <FlightListItem key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}
