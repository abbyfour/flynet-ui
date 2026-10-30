import { FlightListItem } from "@components/panels/flights/FlightListItem";
import type { Aircraft } from "@data/classes/flights/Aircraft";
import type { Flight } from "@data/classes/flights/Flight";
import { uniquifyBy } from "@util/arrayUtil";

import "./AircraftView.scss";

export function AircraftView({
  aircraft,
  flights,
}: {
  aircraft: Aircraft | undefined;
  flights: Flight[];
}) {
  if (!aircraft || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="AircraftView">
      <div className="content">
        <h4 className="title">
          <span className="subtitle">{aircraft.manufacturer}</span>
          <span>{aircraft.model}</span>
        </h4>

        <div className="airlines">
          <h5 className="tiny-header">Airlines:</h5>

          <ul className="airlines-list">
            {uniquifyBy(
              flights.filter((flight) => !!flight.airline),
              (a) => a.airline?.name,
            )
              .sort(
                (a, b) =>
                  a.airline?.name?.localeCompare(b.airline?.name ?? "") ?? 0,
              )
              .map((flight) => (
                <li key={flight.id}>{flight.airline?.name}</li>
              ))}
          </ul>
        </div>

        <div className="flights">
          <h5 className="tiny-header">Flights:</h5>

          <p className="flight-count">
            {flights.length} flights on this aircraft
          </p>

          <div className="flight-list">
            {flights.map((flight) => (
              <FlightListItem key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
