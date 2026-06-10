import { FlightListItem } from "@components/panels/flights/FlightListItem";
import type { Flight } from "@data/classes/flights/Flight";
import type { Plane } from "@data/classes/flights/Plane";
import { selectSelectedFlights } from "@data/services/flights/selectFlights";
import { useAppSelector } from "@data/store";
import { uniquifyBy } from "@util/arrayUtil";

import "./PlaneView.scss";

export function PlaneView({
  plane,
  flights: flightsProp,
}: {
  plane: Plane | undefined;
  flights?: Flight[];
}) {
  const reduxFlights = useAppSelector((state) => selectSelectedFlights(state));
  const flights = flightsProp ?? reduxFlights;

  if (!plane || !flights || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="PlaneView">
      <div className="content">
        <h4 className="title">
          <span className="subtitle">{plane.manufacturer}</span>
          <span>{plane.manufacturerModel}</span>
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

          <p className="flight-count">{flights.length} flights on this plane</p>

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
