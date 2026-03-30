import type { Airline } from "../../../../../../data/classes/flights/Airline";
import { selectSelectedFlights } from "../../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../../data/store";
import { uniquifyBy } from "../../../../../../util/arrayUtil";
import { FlightListItem } from "../FlightListItem";

import "./AirlineView.scss";

export function AirlineView({ airline }: { airline: Airline | undefined }) {
  const flights = useAppSelector((state) => selectSelectedFlights(state));

  if (!airline || !flights || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="AirlineView">
      <div className="content">
        <h4 className="title">
          {airline.name}
          {airline.iataCode && (
            <>
              <span className="subtitle">{airline.iataCode}</span>
            </>
          )}
        </h4>

        <div className="planes">
          <h5 className="tiny-header">Planes:</h5>

          <ul className="planes-list">
            {uniquifyBy(
              flights.filter((flight) => !!flight.airline),
              (a) => a.plane?.model,
            )
              .sort(
                (a, b) =>
                  a.plane?.model?.localeCompare(b.plane?.model ?? "") ?? 0,
              )
              .map((flight) => (
                <li key={flight.id}>{flight.plane?.model}</li>
              ))}
          </ul>
        </div>

        <div className="flights">
          <h5 className="tiny-header">Flights:</h5>

          <p className="flight-count">
            {flights.length} flights for this airline
          </p>
        </div>

        <div className="flight-list">
          {flights.map((flight) => (
            <FlightListItem key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}
