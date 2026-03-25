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
      <h4 className="title">{airline.name}</h4>

      <div className="code">
        <h5>Code:</h5>
        <span>{airline.iataCode || "N/A"}</span>
      </div>

      <div className="planes">
        <h5>Planes:</h5>

        <ul className="planes-list">
          {uniquifyBy(
            flights.filter((flight) => flight.airline),
            (a) => a.plane?.model,
          )
            .sort(
              (a, b) =>
                a.plane?.model?.localeCompare(b.plane?.model ?? "") ?? 0,
            )
            .map((flight) => (
              <li key={flight.id}>{flight.plane?.model || "N/A"}</li>
            ))}
        </ul>
      </div>

      <div>
        <h5>Flights:</h5>

        <p className="flight-count">
          {flights.length} flights for this airline
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
